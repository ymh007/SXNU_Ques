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
    sxnu.GetNotices = function () {
        $.ajax("/Notice/GetNoticeByYear", { async: true, type: "GET", cache: true, data: {}, dataType: "json", }).then(function (result) {
            if (result) {
                $.each(result.Data, function (i, v) {
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