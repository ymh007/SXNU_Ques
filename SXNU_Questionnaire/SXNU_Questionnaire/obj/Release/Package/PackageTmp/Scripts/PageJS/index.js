var SXNU_ViewModel_Index = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.UserInfos = ko.observableArray();

    sxnu.pv_Path = ko.observable("");
    sxnu.newNotice = ko.observableArray([]);
    sxnu.newQuestion = ko.observableArray([]);

    sxnu.GetNotices = function () {
        $.ajax("/Notice/GetIndexNotice", { async: true, type: "GET", cache: true, data: {}, dataType: "json", }).then(function (result) {
            if (result) {
                $.each(result, function (i, v) {
                    if (v.no_Title.length > 20) {
                        v.no_Title = v.no_Title.substr(0, 20) + "...";
                    }
                    sxnu.newNotice.push(v);
                });
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    sxnu.GetQuestion = function () {
        $.ajax("/Ques/GetIndexQuestion", { async: true, type: "GET", cache: true, data: {}, dataType: "json", }).then(function (result) {
            if (result) {
                $.each(result, function (i, v) {
                    if (v.wj_Title.length > 13) {
                        v.wj_Title = v.wj_Title.substr(0, 13) + "...";
                    }
                    v.wj_BeginPic = sxnu.pv_Path() + v.wj_ID + "/" + v.wj_BeginPic;
                    sxnu.newQuestion.push(v);
                });
            }
            sxnu.InitEffect();
        }).fail(function () {
            alert("系统异常！");
        });
    }


    // 初始化 效果
    sxnu.InitEffect = function () {
        //消息举报、删除显示隐藏
        $(".ceng").hide();
        $(".ind_oub ul li").mouseover(function () {
            $(this).find(".ceng").show();
        });
        $(".ind_oub ul li").mouseout(function () {
            $(this).find(".ceng").hide();
        });
    }
    sxnu.PageInit = function () {
        sxnu.pv_Path("/WJ_Attachment/");
        sxnu.GetNotices();
        sxnu.GetQuestion();
    }
    sxnu.PageInit();


}
var SXNU_ViewModel_Index_Notice = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.newNotice = ko.observableArray([]);

    sxnu.Notice_Model = function (y) {
        this.N_Year = ko.observable(y);
        this.YearList = ko.observableArray([]);
    }
    sxnu.GetNotices = function () {
        $.ajax("/Notice/GetNoticeByYear", { async: true, type: "GET", cache: true, data: {}, dataType: "json", }).then(function (result) {
            if (result) {
                $.each(result.Years, function (i, v) {
                    var temp = new sxnu.Notice_Model(v.No_Year);
                    $.each(result.Data, function (index,item) {
                        if (v.No_Year == item.No_Year) {
                            if (item.no_Content.length > 50) {
                                item.no_Content = item.no_Title.substr(0, 50) + "...";
                            }
                            temp.YearList.push(item);
                        }  
                    });
                    sxnu.newNotice.push(temp);
                });
                sxnu.InitEffect();

            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    // 初始化 效果
    sxnu.InitEffect = function () {
        $(".main .year .list").each(function (e, target) {
            var $target = $(target),
                $ul = $target.find("ul");
            $target.height($ul.outerHeight()), $ul.css("position", "absolute");
        });
        $(".main .year>h2>a").click(function (e) {
            e.preventDefault();
            $(this).parents(".year").toggleClass("closes");
        });
    }
    sxnu.PageInit = function () {
        sxnu.GetNotices();
    }
    sxnu.PageInit();
}
var SXNU_ViewModel_Index_Ques = function ($, currentDom) {
    var sxnu = currentDom || this;
   

    sxnu.search = ko.observable("");
    sxnu.dataArray = ko.observableArray([]);

    //==============分页 开始==============
    sxnu.WJ_List = ko.observableArray();

    sxnu.am_CurrenPageIndex = ko.observable(0);//当前第几页
    sxnu.am_PageSize = ko.observable(8); //一页显示多少条数据
    sxnu.am_TotalPage = ko.observable(1); // 页总数
    sxnu.am_TotalRecord = ko.observable();//总记录数
    sxnu.UserIsExits = ko.observable(false);

    sxnu.Search_WJ = function () {
        sxnu.am_CurrenPageIndex(0);
        sxnu.am_TotalPage(1);
        sxnu.GetByPageingData();
    }
    sxnu.Provider = function () {
        if (sxnu.am_CurrenPageIndex() > 0) {
            sxnu.am_CurrenPageIndex(sxnu.am_CurrenPageIndex() - 1);
            sxnu.GetByPageingData();
        }
    }
    sxnu.NextPage = function () {
        if ((sxnu.am_CurrenPageIndex() + 1) == sxnu.am_TotalPage()) { return; }
        sxnu.am_CurrenPageIndex(sxnu.am_CurrenPageIndex() + 1);
        sxnu.GetByPageingData();
    }

    sxnu.GotoPage = function (index) {
        if (index < 0 || index > (sxnu.am_TotalPage() - 1)) {
            return;
        };
        sxnu.am_CurrenPageIndex(index);
        sxnu.GetByPageingData();
    }

    sxnu.GetByPageingData = function () {
        var parmentMode = {
            StrWhere: sxnu.SearchValue().trim(),
            CurrenPageIndex: sxnu.am_CurrenPageIndex(),
            PageSize: sxnu.am_PageSize()
        }
        sxnu.WJ_List.removeAll();
        $.ajax("/Admin/Question/QuesListByPage", { async: true, cache: false, type: "GET", data: parmentMode, dataType: "json" }).then(function (result) {
            if (result) {

                $.each(result.Data, function (i, v) {
                    if (v.wj_Title.length > 10) {
                        v.wj_Title = v.wj_Title.substr(0, 10) + "...";
                    }
                    if (v.wj_ProjectSource.length > 10) {
                        v.wj_ProjectSource = v.wj_ProjectSource.substr(0, 10) + "...";
                    }
                    sxnu.WJ_List.push(v);
                });
                sxnu.am_TotalPage(result.TotalPages);
                sxnu.am_TotalRecord(result.TotalRecords);
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    //==============分页 结束===============
   
    sxnu.GetQuestion = function () {

        $.ajax("/Ques/GetIndexQuestion", { async: true, type: "GET", cache: true, data: {}, dataType: "json", }).then(function (result) {
            if (result) {
                $.each(result, function (i, v) {
                    if (v.wj_Title.length > 13) {
                        v.wj_Title = v.wj_Title.substr(0, 13) + "...";
                    }
                    v.wj_BeginPic = sxnu.pv_Path() + v.wj_ID + "/" + v.wj_BeginPic;
                    sxnu.newQuestion.push(v);
                });
            }
            sxnu.InitEffect();
        }).fail(function () {
            alert("系统异常！");
        });
    }

    sxnu.GetQueryString =function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    
    sxnu.PageInit = function () {
        sxnu.search(sxnu.GetQueryString('v'));
        console.log(sxnu.search());
    }
    sxnu.PageInit();


}
