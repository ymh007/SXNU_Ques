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
                   
                    if (v.wj_BeginPic) {
                        v.wj_BeginPic = sxnu.pv_Path() + v.wj_ID + "/" + v.wj_BeginPic;
                    } else {
                        var max = 8, min = 1;
                        var name = parseInt(Math.random() * (max - min + 1) + min, 10);
                        var defPath = "/Content/images/com/d" + name + ".jpg";
                        v.wj_BeginPic = defPath;
                    }
                    sxnu.newQuestion.push(v);
                });
            }
            sxnu.InitEffect();
            sxnu.IsImg_Load();
        }).fail(function () {
            alert("系统异常！");
        });
    }
    sxnu.SetDefault = function (val) {
        var max = 8, min = 1;
        var name = parseInt(Math.random() * (max - min + 1) + min, 10);
        var defPath = "/Content/images/com/" + name + ".jpg";
        $("#" + val.wj_ID).attr('src', defPath);
        //var img = $("#" + val.wj_ID).srcElement;
        //img.onerror = null;// 控制不要一直跳动
    }
    sxnu.IsImg_Load = function () {
        //data-bind="attr:{class: IsExpire=='y' ? 'ind_hui pos_abs ceng':'ind_lan pos_abs ceng'}"
        $("#questionList div[name]").each(function () {
            if (this.name == "y") {
                this.className="ind_hui pos_abs ceng";
            } else {
                this.className="ind_lan pos_abs ceng";
            }
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
        sxnu.GetQuestion();
        sxnu.GetNotices();
        
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
                    $.each(result.Data, function (index, item) {
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

    sxnu.input_Code = ko.observable("");
    sxnu.currentRowCode = ko.observable("");
    sxnu.currentRowWJID = ko.observable(0);
    sxnu.search = ko.observable("");
    sxnu.dataArray = ko.observableArray([]);

    //==============分页 开始==============
    sxnu.WJ_List = ko.observableArray();

    sxnu.am_CurrenPageIndex = ko.observable(0);//当前第几页
    sxnu.am_PageSize = ko.observable(10); //一页显示多少条数据
    sxnu.am_TotalPage = ko.observable(1); // 页总数
    sxnu.am_TotalRecord = ko.observable(0);//总记录数

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


    /*
   CREATE TABLE #NQ_T
   ( 
   ID INT ,
   N_Q char(1),
   Title VARCHAR(1000),  
   Content  VARCHAR(8000), 
   publishTime datetime,
   StartTime datetime,
   EndTime datetime,
   publishP VARCHAR(100),
   IsExpire char(1),
   QStatus char(1)
   )  
   */
    sxnu.GetByPageingData = function () {
        var parmentMode = {
            StrWhere: sxnu.search(),
            CurrenPageIndex: sxnu.am_CurrenPageIndex(),
            PageSize: sxnu.am_PageSize()
        }
        sxnu.WJ_List.removeAll();
        $("#row_list").unbind("click").click(function (e) { });
        $("#row_list div").remove();
        $.ajax("/Ques/GetIndexQuesData", { async: true, cache: false, type: "GET", data: parmentMode, dataType: "json" }).then(function (result) {
            if (result) {
                $.each(result.Data, function (i, v) {
                    //if (v.Title.length > 10) {
                    //    v.Title = v.Title.substr(0, 10) + "...";
                    //}
                    if (v.Content.length > 10) {
                        v.Content = v.Content.substr(0, 10) + "...";
                    }
                    if (sxnu.search()) {
                        if (v.N_Q == 'q') {
                            var html_q = " <div class=\"ques m-b20\">";
                            html_q += "<div class=\"left w-20 m-t10\"><img src=\"../Content/images/dian.jpg\"></div>";
                            html_q += "<div class=\"left w-960\">";
                            if (v.IsExpire == "y") {
                                html_q += "<div  class=\"left couts\">已过期</div>";
                            } else {
                                html_q += "<div  class=\"left cout\">进行中</div>";
                            }
                            html_q += "<h2 class=\"left m-l10\"><a  href=\"/Ques/QuesFirstStep?ID=" + v.ID + "\"> " + v.Title.replace(sxnu.search(), "<span>" + sxnu.search() + "</span>") + "</a></h2>";
                            html_q += "<div class=\"clear\"></div>";
                            html_q += "<div class=\"left m-t15 qu_time\">有效期：" + v.StartTime + " -- " + v.EndTime + "</div>";
                            html_q += "<div class=\"right m-t15 qu_time\">发布者：" + v.publishP + " &nbsp;&nbsp;&nbsp;&nbsp; 发布时间：" + v.publishTime + "</div>";
                            html_q += "</div>";
                            html_q += "<div class=\"clear\"></div>";
                            html_q += "<img class=\"m-t20\" src=\"../Content/images/heng.jpg\">";
                            html_q += "</div>";
                            $("#row_list").append(html_q);
                            //if (v.IsExpire == "n") {
                            //    $("#" + v.ID).click(function () {
                            //        $("#Validate_Code").dialog({
                            //            resizable: false,
                            //            height: 200,
                            //            width: 300,
                            //            modal: true
                            //        });
                            //        sxnu.currentRowCode(this.className);
                            //        sxnu.currentRowWJID(this.id);

                            //    });
                            //}

                        }
                        if (v.N_Q == 'n') {
                            var html_a = "<div class=\"ques m-b20\">";
                            html_a += "<div class=\"left w-20 m-t10\"><img src=\"../Content/images/dian.jpg\"></div>";
                            html_a += "<div class=\"left w-960\">";
                            html_a += "<h2 class=\"left\"><a href=\"javascript:;\">" + v.Title.replace(sxnu.search(), "<span>" + sxnu.search() + "</span>") + "</a></h2><div class=\"right qu_time\">" + v.publishTime + "</div>";
                            html_a += "<div class=\"clear\"></div>";
                            html_a += "<div class=\"m-t10\">" + v.Content + "<span class=\"m-l10\"><a  href=\"/Notice/NoticeDetail?ID=" + v.ID + "\">查看详情</a></span></div>";
                            html_a += "</div>";
                            html_a += " <div class=\"clear\"></div>";
                            html_a += "<img class=\"m-t20\" src=\"../Content/images/heng.jpg\">";
                            html_a += "</div>";
                            $("#row_list").append(html_a);
                        }
                    } else {
                        var html_q = " <div class=\"ques m-b20\">";
                        html_q += "<div class=\"left w-20 m-t10\"><img src=\"../Content/images/dian.jpg\"></div>";
                        html_q += "<div class=\"left w-960\">";
                        if (v.IsExpire == "y") {
                            html_q += "<div  class=\"left couts\">已过期</div>";
                        } else {
                            html_q += "<div  class=\"left cout\">进行中</div>";
                        }
                        html_q += "<h2 class=\"left m-l10\"><a  href=\"/Ques/QuesFirstStep?ID=" + v.ID + "\"> " + v.Title.replace(sxnu.search(), "<span>" + sxnu.search() + "</span>") + "</a></h2>";
                        html_q += "<div class=\"clear\"></div>";
                        html_q += "<div class=\"left m-t15 qu_time\">有效期：" + v.StartTime + " -- " + v.EndTime + "</div>";
                        html_q += "<div class=\"right m-t15 qu_time\">发布者：" + v.publishP + " &nbsp;&nbsp;&nbsp;&nbsp; 发布时间：" + v.publishTime + "</div>";
                        html_q += "</div>";
                        html_q += "<div class=\"clear\"></div>";
                        html_q += "<img class=\"m-t20\" src=\"../Content/images/heng.jpg\">";
                        html_q += "</div>";
                        $("#row_list").append(html_q);
                        //if (v.IsExpire == "n") {
                        //    $("#" + v.ID).click(function () {
                        //        $("#Validate_Code").dialog({
                        //            resizable: false,
                        //            height: 200,
                        //            width: 300,
                        //            modal: true
                        //        });
                        //        sxnu.currentRowCode(this.className);
                        //        sxnu.currentRowWJID(this.id);


                        //    });
                        //}

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
        $.ajax("/Ques/GetIndexQuestion", { async: true, type: "GET", cache: true, data: parmentMode, dataType: "json", }).then(function (result) {
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

    sxnu.GetQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }

    sxnu.PageInit = function () {
        sxnu.search(sxnu.GetQueryString('v'));
        $("#g_serach").val(sxnu.search());
        sxnu.GetByPageingData(sxnu.search());
    }
    sxnu.PageInit();


}
var SXNU_ViewModel_Index_FirstStep = function ($, currentDom) {
    var sxnu = currentDom || this;
    //FRCMMMWI23X7X
    sxnu.input_Code = ko.observable("");
    sxnu.currentRowCode = ko.observable("");
    sxnu.currentRowWJID = ko.observable(0);
    sxnu.IsExprire = ko.observable("");
    sxnu.wjid = ko.observable("");


    sxnu.Val_Code = function (val) {
        $("#Validate_Code").dialog({
            resizable: false,
            height: 200,
            width: 300,
            modal: true
        });
    }

    sxnu.AuswerWJ = function () {
        var code = $.trim(sxnu.input_Code());
        if (!code) {
            alert("认证码不能为空");
            return false;
        }
        if (code.length != 13) {
            alert("认证码格式不正确");
            return false;
        }
        $.ajax("/Ques/Validate_Code", { async: true, type: "GET", cache: true, data: { wjid: sxnu.wjid(), code: sxnu.input_Code() }, dataType: "json", }).then(function (result) {
            if (result) {
                if (result.IsSuccess) {
                    window.location.href = "/Ques/QuesTwoStep?ID=" + sxnu.wjid();
                } else {
                    alert(result.ErrorMsg);
                }
            }
        }).fail(function () {
            alert("系统异常！");
        });

    }
    sxnu.PageInit = function () {
        sxnu.wjid($("#wjid").val());
        sxnu.IsExprire($("#isexp").val());
    }
    sxnu.PageInit();
}

var SXNU_ViewModel_Index_BaseInfo = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.baseInfoID = ko.observable(0);
    sxnu.wj_id = ko.observable(0);
    sxnu.Nameck = ko.observable("");
    sxnu.NameVal = ko.observable("");
    sxnu.ControlList = ko.observableArray([]);
    sxnu.EnumControlsType = {
        wbk: "文本框",
        dxan: "单选按钮",
        xlcd: "下拉菜单"
    }
    sxnu.ConorlesMode = function (ck, tit, ty, val, list) {
        this.ck = ko.observable(ck);
        this.tit = ko.observable(tit);
        this.ty = ko.observable(ty);
        this.val = ko.observable(val);
        this.list = ko.observableArray(list);
        this.iv = ko.observable("");
        this.name = Math.random(1, 1000);
    }
    sxnu.GetBaseInfoByID = function () {
        $.ajax("/Ques/GetBaseInfoBy_WJID", { async: true, type: "GET", cache: true, data: { ID: sxnu.wj_id() }, dataType: "json", }).then(function (result) {
            if (result) {
                if (result.length == 1) {
                    sxnu.Nameck(result[0].wj_PageSize);
                    var Temp = JSON.parse(result[0].wj_BaseInfo);
                    $.each(Temp, function (i, v) {
                        var T = new sxnu.ConorlesMode(v.ck, v.tit, v.ty, v.val, []);
                        if (sxnu.EnumControlsType.wbk == v.ty) {
                            if (!v.val) {
                                T.val(255);
                            }
                        }
                        if (sxnu.EnumControlsType.dxan == v.ty) {
                            var str = v.val;
                            var array = str.replace(' ', '').split("|");
                            T.list(array);
                        }
                        if (sxnu.EnumControlsType.xlcd == v.ty) {
                            var str = v.val;
                            var array = str.replace(' ', '').split("|");
                            T.list(array);
                        }
                        sxnu.ControlList.push(T);
                    });
                }
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    sxnu.GoTwoStep = function () {
        //$("body").mask("正在加载.......");
        var mode = {
            au_ID: "",
            au_wjID: sxnu.wj_id(),
            au_AnswerUserInfo: "",
            au_Time: "",
            au_Name: $.trim(sxnu.NameVal())
        };
        var dataArray = [];
        var flag = true;
        var msg = "";
        $.each(sxnu.ControlList(), function (index, item) {
            var t = { ck: item.ck(), tit: item.tit(), ty: item.ty(), val: item.val(), iv: $.trim(item.iv()) };
            if (item.ck() == "1") {
                if ($.trim(item.iv()) == "") {
                    flag = false; msg = item.tit() + " 不能为空！";
                    return false;
                }
            }
            dataArray.push(t);
        });

        if (sxnu.Nameck() == "1") {
            if (!$.trim(sxnu.NameVal())) {
                alert("姓名不能为空"); return false;
            }
        }
        if (!flag) { $("body").unmask(); alert(msg); return false; }
        mode.au_AnswerUserInfo = JSON.stringify(dataArray);
        $.ajax("/Ques/InsertBaseInfo", { async: true, type: "GET", cache: true, data: mode, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                window.location.href = "/Ques/Answer?id=" + sxnu.wj_id() + "&aid=" + result.ReturnADD_ID;
            } else {
                //$("body").unmask();
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    sxnu.GetQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }

    sxnu.PageInit = function () {
        sxnu.wj_id($("#wj_id").val());
        sxnu.GetBaseInfoByID();

    }
    sxnu.PageInit();


}
var SXNU_ViewModel_Answer = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.wj_ID = ko.observable(0);
    sxnu.au_id = ko.observable(0);
    sxnu.answerTime = ko.observable(0);
    sxnu.stType = {   //  数据库分别代表  1 2 3 4 5
        dx: "单选题",
        dux: "多选题",
        wd: "问答题",
        zh: "组合题",
        bg: "表格题"
    }
    sxnu.stWareMsg = {
        TimeFinish: "对不起，您已超时，该题作废",
        relation: "逻辑关系跳过该题"

    }



    // commmon  ====== 
    sxnu.ViewImg = function (val) {
        var imgpath = "/WJ_Attachment/" + sxnu.wj_ID() + "/" + val.n;
        window.open(imgpath);
    }
    //===========================================试题展示信息 以及 试题编号=== 开始=====================

    sxnu.ShowSTByLoccation = function (Te_STMode, showNumber) {
        switch (parseInt(Te_STMode.wt_Type)) {
            case 1:
                var dxModel = new sxnu.ddxST_Model(Te_STMode.wt_ID, showNumber, parseInt(Te_STMode.wt_Type));
                dxModel.wt_Title(Te_STMode.wt_Title);
                dxModel.wt_LimitTime(Te_STMode.wt_LimitTime);
                dxModel.wt_LogicRelated(Te_STMode.wt_LogicRelated);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    dxModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });
                var item = JSON.parse(Te_STMode.wt_Options == "" ? "[]" : Te_STMode.wt_Options);
                $.each(item, function (i, val) {
                    var temp = new sxnu.item_model(val.t, val.f);
                    temp.r(val.r);
                    //$.each(val.pv, function (i1, val1) {
                    //    temp.pv.push(val1);
                    //});
                    temp.pv(val.pv);
                    if ('o' in val) {
                        dxModel.wt_OtherItem.push(temp);
                    } else {
                        dxModel.wt_Options.push(temp);
                    }
                });
                sxnu.ShowSTInfo.push(dxModel);
                break;
            case 2:
                var dxModel = new sxnu.ddxST_Model(Te_STMode.wt_ID, showNumber, Te_STMode.wt_Type);
                dxModel.wt_Title(Te_STMode.wt_Title);
                dxModel.wt_LimitTime(Te_STMode.wt_LimitTime);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    dxModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });
                var item = JSON.parse(Te_STMode.wt_Options == "" ? "[]" : Te_STMode.wt_Options);
                $.each(item, function (i, val) {
                    var temp = new sxnu.item_model(val.t, val.f);
                    $.each(val.pv, function (i1, val1) {
                        temp.pv.push(val1);
                    });
                    if ('o' in val) {
                        dxModel.wt_OtherItem.push(temp);
                    } else {
                        dxModel.wt_Options.push(temp);
                    }
                });
                sxnu.ShowSTInfo.push(dxModel);
                break;
            case 3:
                var wtModel = new sxnu.wdST_Model(Te_STMode.wt_ID, showNumber, Te_STMode.wt_Type);
                wtModel.Title(Te_STMode.wt_Title);
                wtModel.Time(Te_STMode.wt_LimitTime);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    wtModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });

                var item = JSON.parse(Te_STMode.wt_Options);  // cl 内容长度   o 是否在线   c 是否自定义答案条数   u 是否可以上传附件 
                wtModel.Contentlength(item.cl);
                wtModel.IsOnline(item.o);
                wtModel.Customize(item.c);
                wtModel.IsUpload(item.u);
                wtModel.inputArray = ko.observableArray([]);
                if (wtModel.Customize() == 1) {
                    wtModel.inputArray.push({ txt: "" });
                    wtModel.inputArray.push({ txt: "" });
                }

                sxnu.ShowSTInfo.push(wtModel);
                break;
            case 4:
                var zhModel = new sxnu.zhST_Model(Te_STMode.wt_ID, showNumber, Te_STMode.wt_Type);
                zhModel.Title(Te_STMode.wt_Title);
                zhModel.Time(Te_STMode.wt_LimitTime);
                zhModel.st_GaiYao(Te_STMode.wt_Options);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    zhModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });
                sxnu.ShowSTInfo.push(zhModel);
                break;
            case 5:
                var bgModel = new sxnu.bgST_Model(Te_STMode.wt_ID, showNumber, Te_STMode.wt_Type);
                bgModel.Title(Te_STMode.wt_Title);
                bgModel.Time(Te_STMode.wt_LimitTime);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    bgModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });

                var item_at = JSON.parse(Te_STMode.wt_Options);
                $.each(item_at.t, function (i, val) {
                    var temp = new sxnu.m_t_5(val);
                    temp.name = Math.random(0, 1).toString().replace('.', '');
                    bgModel.TitleLsit.push(temp);
                });
                $.each(item_at.a, function (i, val) {
                    bgModel.AnswerList.push(new sxnu.m_a_5(val.t, val.f));
                });
                sxnu.ShowSTInfo.push(bgModel);
                break;
        }
    }

    // 试题 编号 试题展示 
    sxnu.pv_Path = ko.observable("");

    sxnu.item_model = function (item, fz) {
        this.hs_pv = ko.observable(false);
        this.id = ko.observable(("vp" + Math.random(1, 10000)).replace('.', ''));
        this.item = ko.observable(item);
        this.fz = ko.observable(fz);
        this.pv = ko.observableArray([]);
        this.ck = ko.observable("");
        this.ov = ko.observable("");
        this.r = ko.observable(0);
    }
    sxnu.ShowSTInfo = ko.observableArray();  //  展示试题信息的数组对象
    sxnu.ddxST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);
        this.Title_pic_vido = ko.observableArray();

        this.wt_LimitTime = ko.observable();
        this.wt_Title = ko.observable();
        this.wt_Problem = ko.observableArray();
        this.wt_Options = ko.observableArray();
        this.wt_OtherItem = ko.observableArray();
        this.wt_LogicRelated = ko.observable("");
        this.IsExpire = ko.observable(false);
        this.answer = ko.observable("");
        this.ov = ko.observable("");

        this.jy = ko.observable(true); // 禁用
        this.msg = ko.observable(""); // 消息提示
    }
    sxnu.wdST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);

        this.Title_pic_vido = ko.observableArray();
        this.Title = ko.observable("");
        this.Time = ko.observable(0);

        this.Ansure_Content = ko.observable("");
        this.Contentlength = ko.observable(0);
        this.Clac_Len = ko.observable(0);
        this.IsOnline = ko.observable(0);
        this.Customize = ko.observable(0);
        this.IsUpload = ko.observable(0);
        this.inputArray = ko.observableArray([]);
        this.IsExpire = ko.observable(false);
        this.Clac_Len = ko.computed(function () {
            if (parseInt(this.Contentlength()) != 0) {
                if (this.Ansure_Content().length > parseInt(this.Contentlength())) {
                    var str = this.Ansure_Content().substr(0, this.Contentlength());
                    this.Ansure_Content(str);
                    return 0;
                } else {
                    return parseInt(this.Contentlength()) - this.Ansure_Content().length;
                }
            } else {
                return this.Ansure_Content().length;
            }
        }, this);
        this.Add_wdSTItem = function (val) {
            val.inputArray.push({ txt: "" });
        };
        this.Del_wdSTItem = function (val, v) {
            if (val.inputArray().length == 1) {
                return false;
            }
            val.inputArray.remove(v);
        };

        this.jy = ko.observable(true); // 禁用
        this.msg = ko.observable(""); // 消息提示
    }
    sxnu.zhST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);

        this.Title_pic_vido = ko.observableArray();
        this.Title = ko.observable();
        this.Time = ko.observable(0);
        this.st_GaiYao = ko.observable();
        this.IsExpire = ko.observable(false);

        this.jy = ko.observable(true); // 禁用
        this.msg = ko.observable(""); // 消息提示
    }
    sxnu.bgST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);

        this.Title_pic_vido = ko.observableArray();
        this.Title = ko.observable("");
        this.Time = ko.observable(0);
        this.TitleLsit = ko.observableArray();
        this.AnswerList = ko.observableArray();
        this.IsExpire = ko.observable(false);


        this.msg = ko.observable(""); // 消息提示
    }
    sxnu.m_t_5 = function (t) {
        this.t = ko.observable(t);
        this.f = ko.observable(0);
        this.ck = ko.observable("");
        this.getF = function (val) {
            this.f(val.f());
        };
        this.jy = ko.observable(true); // 禁用

    }
    sxnu.m_a_5 = function (a, f) {
        this.a = ko.observable(a);
        this.f = ko.observable(f);
    }


    //===========================================试题展示信息 以及 试题编号=== 结束=====================

    sxnu.CloseConfirm = function (val) {
        $("#conifmNextPage").dialog('close');
    }
    sxnu.finishWT = function () {
        window.location.href = "/Home/Index";
    }


    sxnu.TestData = function () {
        sxnu.TimeOut_Mask();
    }
    sxnu.ShowSubmitedInfo = function (val) {
        $("#wj_finish").dialog({
            resizable: false,
            closeOnEscape: false,
            open: function (event, ui) { $(".ui-dialog-titlebar-close").hide(); },
            height: 400,
            width: 500,
            modal: true
        });
    }
    sxnu.TimeOut_Mask = function (val) {
        $("#time_out").dialog({
            resizable: false,
            closeOnEscape: false,
            open: function (event, ui) { $(".ui-dialog-titlebar-close").hide(); },
            height: 300,
            width: 400,
            modal: true
        });
    }
    sxnu.ShowConfirm = function (val) {
        $("#conifmNextPage").dialog({
            resizable: false,
            height: 300,
            width: 500,
            modal: true
        });
    }
    sxnu.StartRelation = function (parent, item) {
        var currShowNum = parseFloat(parent.ShowNum());
        var dbid = item.r();
        if (item.r()) {  // 有逻辑关系
            $.each(sxnu.ShowSTInfo(), function (i, v) {
                if (v.dbID() == dbid) {
                    return false;
                }
                if (parseFloat(v.ShowNum()) > currShowNum) {
                    if (v.type() == 5) {
                        $.each(v.TitleLsit(), function (ti, titem) {
                            titem.jy(false);  //开始跳过试题
                        });
                    } else {
                        v.jy(false);
                    }
                    v.msg(sxnu.stWareMsg.relation); // 显示跳转信息
                }
            });
        } else { // 没有逻辑关系
            $.each(sxnu.ShowSTInfo(), function (i, v) {
                if (v.dbID() == dbid) {
                    return false;
                }
                if (parseFloat(v.ShowNum()) > currShowNum) {
                    if (v.type() == 5) {
                        $.each(v.TitleLsit(), function (ti, titem) {
                            titem.jy(true);
                        });
                    } else {
                        v.jy(true);
                    }
                    v.msg("");
                }
            });
        }
    }
    //    1  点击下一页的时候   2点击提交问卷的时候
    sxnu.NextPageWT = function () {
        sxnu.SaveAnswer(1);
    }

    sxnu.SubmitedWJ = function () {
        sxnu.SaveAnswer(2);
    }

    var Test = function (r, i, l, w) {
        this.an_Result = r;
        this.an_Invalid = i;
        this.an_leapfrog = l;
        this.an_wtType = w;
    }


    sxnu.SaveAnswer = function (status) {
        var listArray = [];
        var flag = true;
        var errorMsg = "";

        var CommonMode = {
            au_Time: sxnu.Answer_Time(),
            an_auID: sxnu.au_id(),
            dataArrayStr: ""
        };
        $.each(sxnu.ShowSTInfo(), function (index, item) {
            var Save_Model = {
                an_Result: "",
                an_Invalid: "",
                an_leapfrog: "",
                an_wtType: "",
                an_wtID: 0
            };
            Save_Model.an_wtType = item.type();
            Save_Model.an_wtID = item.dbID();
            switch (parseInt(item.type())) {
                case 1:
                    if (!item.jy()) {
                        Save_Model.an_leapfrog = "y";
                        Save_Model.an_Result = "";
                    } else {
                        if (item.answer()) {
                            $.each(item.wt_OtherItem(), function (a, b) {
                                if (b.item() == item.answer()) {
                                    if (!$.trim(item.ov())) {
                                        flag = false;
                                        errorMsg = "请输入试题 " + item.ShowNum() + " 的答案！";
                                        return false;
                                    }
                                }
                            })
                        } else {
                            flag = false;
                            errorMsg = "请选择试题 " + item.ShowNum() + " 的答案！";
                            return false;
                        }
                        var strObj = { an: item.answer(), ov: item.ov() };
                        Save_Model.an_Result = JSON.stringify(strObj);
                    }

                    break;
                case 2:
                    if (!item.jy()) {
                        Save_Model.an_leapfrog = "y";
                        Save_Model.an_Result = "";
                    } else {
                        var duo2 = [];
                        $.each(item.wt_Options(), function (i, v) {
                            if (v.ck()) {
                                duo2.push({ an: v.item(), ov: "" });
                            }
                        });

                        $.each(item.wt_OtherItem(), function (i, v) {
                            if (v.ck()) {
                                if ($.trim(v.ov())) {
                                    duo2.push({ an: v.item(), ov: v.ov() });
                                } else {
                                    flag = false;
                                    errorMsg = "请输入试题 " + item.ShowNum() + " 的答案！";
                                    return false;
                                }
                            }
                        });
                        if (duo2.length == 0) {
                            flag = false;
                            errorMsg = "请选择试题 " + item.ShowNum() + " 的答案！";
                            return false;
                        }
                        Save_Model.an_Result = JSON.stringify(duo2);
                    }

                    break;
                case 3:
                    if (!item.jy()) {
                        Save_Model.an_leapfrog = "y";
                        Save_Model.an_Result = "";
                    } else {
                        var wd3 = [];
                        if (item.Customize() == '1') {
                            $.each(item.inputArray(), function (i, v) {
                                if (!$.trim(v.txt)) {
                                    flag = false;
                                    errorMsg = "请输入试题 " + item.ShowNum() + " 的答案！";
                                    return false;
                                } else {
                                    wd3.push(v.txt);
                                }
                            });
                        }

                        if (item.IsOnline() == '1' && item.Customize() == '0') {
                            if (!$.trim(item.Ansure_Content())) {
                                flag = false;
                                errorMsg = "请输入试题 " + item.ShowNum() + " 的答案！";
                                return false;
                            } else {
                                wd3.push(item.Ansure_Content());
                            }
                        }
                        Save_Model.an_Result = JSON.stringify(wd3);
                    }
                    break;
                case 4:
                    if (!item.jy()) {
                        Save_Model.an_leapfrog = "y";
                        Save_Model.an_Result = "";
                    } else {
                        Save_Model.an_Result = "";
                    }

                    break;
                case 5:
                    var isGo = item.TitleLsit()[0].jy();
                    if (!isGo) {
                        Save_Model.an_leapfrog = "y";
                        Save_Model.an_Result = "";
                    } else {
                        var bg5 = [];
                        $.each(item.TitleLsit(), function (i, v) {
                            if (!v.ck()) {
                                flag = false;
                                errorMsg = "请选择试题 " + item.ShowNum() + " 的  " + v.t() + " 答案！";
                                return false;
                            } else {
                                bg5.push(v.ck());
                            }
                        });
                        Save_Model.an_Result = JSON.stringify(bg5);
                    }
                    break;

            }
            if (!flag) {
                return false;
            }
            listArray.push(Save_Model);
        });

        if (!flag) {
            alert(errorMsg);
            return false;
        } else {
            CommonMode.dataArrayStr = JSON.stringify(listArray);
            $.ajax("/Ques/SaveAnswer", { async: true, type: "POST", data: CommonMode, dataType: "json", }).then(function (result) {
                if (result) {
                    if (result.IsSuccess) {
                        if (status == 1) {
                            var currentCount = sxnu.ShowSTInfo().length;
                            sxnu.Globle_STList().splice(0, currentCount);
                            sxnu.ShowSTInfo.removeAll();
                            $.each(sxnu.Globle_STList(), function (index, item) {
                                if (item.wt_Pageing == "y") {
                                    sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
                                    return false;
                                }
                                sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
                            });
                            sxnu.CloseConfirm();
                            sxnu.PageCount(sxnu.PageCount() - 1);
                        }
                        if (status == 2) {
                            sxnu.ShowSubmitedInfo();
                        }
                    } else {
                        alert("答案保存失败！");
                    }
                }
            }).fail(function () {
                alert("添加答案保存失败！");
            });

        }
    }



    sxnu.PageCount = ko.observable(0);
    sxnu.TotalWJ = ko.observable(0);
    sxnu.ST_NumList = ko.observableArray();
    sxnu.subNumList = ko.observableArray();
    sxnu.Globle_STList = ko.observableArray();
    sxnu.Load_ST_List = function () {
        $("body").mask("正在加载.......");
        if (sxnu.wj_ID() != 0) {
            $.ajax("/Ques/GetSTBy_WJID", { async: true, type: "GET", cache: true, data: { ID: sxnu.wj_ID() }, dataType: "json", }).then(function (result) {
                if (result) {
                    sxnu.TotalWJ(result.length);
                    var par_num = 1;
                    $.each(result, function (i, v) {
                        if (v.wt_PID != 0) {
                            sxnu.subNumList.push(v); // 记录子级试题编号
                        } else {
                            v.wt_OrderNum = par_num;
                            sxnu.ST_NumList.push(v);
                            par_num++;
                        }
                        if (v.wt_Pageing == "y") {
                            sxnu.PageCount(parseInt(sxnu.PageCount()) + 1);
                        }
                    });
                    // 规整所有试题的编号
                    $.each(sxnu.ST_NumList(), function (i, v) {
                        sxnu.Globle_STList.push(v);
                        if (v.wt_Type == 4) {
                            var num = 1;
                            $.each(sxnu.subNumList(), function (i1, item) {
                                if (v.wt_ID == item.wt_PID) {
                                    item.wt_OrderNum = v.wt_OrderNum + "." + num;
                                    sxnu.Globle_STList.push(item);
                                    num++
                                }
                            });
                            num = 1;
                        }
                    });

                    // 页面加载的时候初始化试题第一页
                    $.each(sxnu.Globle_STList(), function (index, item) {
                        if (item.wt_Pageing == "y") {
                            sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
                            return false;
                        }
                        sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
                    });
                    $("body").unmask();
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }

    //======  记录时间的计时器
    sxnu.g_id = ko.observable(0);
    sxnu.intDiff = ko.observable(parseInt($("#wj_time").val()) * 60); //倒计时总秒数量
    sxnu.Answer_Time = ko.observable(0);
    //======
    sxnu.StartTime = function (intDiff) {
        sxnu.g_id(window.setInterval(function () {
            var day = 0,
                hour = 0,
                minute = 0,
                second = 0;//时间默认值
            if (intDiff > 0) {
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            hour = hour == 0 ? "00" : hour;
            var ShowTime = hour + ":" + minute + ":" + second;
            $('#Countdown').text(ShowTime);
            intDiff--;
            sxnu.Answer_Time(sxnu.Answer_Time() + 1);
            if (intDiff < 0) {
                sxnu.TimeOut_Mask();
                clearTimeout(sxnu.g_id());
            }
        }, 1000));

    }
    sxnu.Empty_StartTime = function () {
        sxnu.g_id(window.setInterval(function () {
            sxnu.Answer_Time(sxnu.Answer_Time() + 1);
        }, 1000));

    }
    sxnu.PageInit = function () {
        //$(window).bind('beforeunload', function () {
        //    return '你确认要离开本页面吗？';
        //});
        sxnu.wj_ID($("#wj_id").val());
        sxnu.au_id($("#au_id").val());
        sxnu.pv_Path("/WJ_Attachment/" + $("#wj_id").val() + "/");


        sxnu.Load_ST_List();
        if (sxnu.intDiff() != 0) {
            sxnu.StartTime(sxnu.intDiff());
        } else {
            sxnu.Empty_StartTime();
        }


    }
    sxnu.PageInit();


}

var SXNU_ViewModel_ViewAnswer = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.wj_ID = ko.observable(0);
    sxnu.au_id = ko.observable(0);
    sxnu.AnswerTime = ko.observable(0);
    sxnu.stType = {   //  数据库分别代表  1 2 3 4 5
        dx: "单选题",
        dux: "多选题",
        wd: "问答题",
        zh: "组合题",
        bg: "表格题"
    }
    sxnu.stWareMsg = {
        TimeFinish: "对不起，您已超时，该题作废",
        relation: "逻辑关系跳过该题"

    }



    // commmon  ====== 
    sxnu.ViewImg = function (val) {
        var imgpath = "/WJ_Attachment/" + sxnu.wj_ID() + "/" + val.n;
        window.open(imgpath);
    }
    //===========================================试题展示信息 以及 试题编号=== 开始=====================

    sxnu.ShowSTByLoccation = function (Te_STMode, showNumber) {
        switch (parseInt(Te_STMode.wt_Type)) {
            case 1:

                var dxModel = new sxnu.ddxST_Model(Te_STMode.wt_ID, showNumber, parseInt(Te_STMode.wt_Type));
                dxModel.wt_Title(Te_STMode.wt_Title);
                dxModel.wt_LimitTime(Te_STMode.wt_LimitTime);
                dxModel.wt_LogicRelated(Te_STMode.wt_LogicRelated);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    dxModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });

                var item = JSON.parse(Te_STMode.wt_Options == "" ? "[]" : Te_STMode.wt_Options);
                $.each(item, function (i, val) {
                    var temp = new sxnu.item_model(val.t, val.f);
                    temp.r(val.r);
                    //$.each(val.pv, function (i1, val1) {
                    //    temp.pv.push(val1);
                    //});
                    temp.pv(val.pv);
                    if ('o' in val) {
                        dxModel.wt_OtherItem.push(temp);
                    } else {
                        dxModel.wt_Options.push(temp);
                    }
                });
                if (Te_STMode.an_leapfrog == "y") {
                    dxModel.jy(false);
                    dxModel.msg(sxnu.stWareMsg.relation);
                } else {
                    var an1 = JSON.parse(Te_STMode.an_Result == "" ? "[]" : Te_STMode.an_Result);
                    dxModel.answer(an1.an);
                    dxModel.ov(an1.ov == "" ? "" : an1.ov);
                }
                sxnu.ShowSTInfo.push(dxModel);
                break;
            case 2:
                var dxModel = new sxnu.ddxST_Model(Te_STMode.wt_ID, showNumber, Te_STMode.wt_Type);
                dxModel.wt_Title(Te_STMode.wt_Title);
                dxModel.wt_LimitTime(Te_STMode.wt_LimitTime);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    dxModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });
                var item = JSON.parse(Te_STMode.wt_Options == "" ? "[]" : Te_STMode.wt_Options);
                var an2 = JSON.parse(Te_STMode.an_Result == "" ? "[]" : Te_STMode.an_Result);
                $.each(item, function (i, val) {
                    var temp = new sxnu.item_model(val.t, val.f);
                    $.each(val.pv, function (i1, val1) {
                        temp.pv.push(val1);
                    });
                    $.each(an2, function (a, c) {
                        if (val.t == c.an) {
                            temp.ck(true);
                            temp.ov(c.ov == "" ? "" : c.ov);
                        }
                    });
                    if ('o' in val) {
                        dxModel.wt_OtherItem.push(temp);
                    } else {
                        dxModel.wt_Options.push(temp);
                    }

                });

                if (Te_STMode.an_leapfrog == "y") {
                    dxModel.jy(false);
                    dxModel.msg(sxnu.stWareMsg.relation);
                }
                sxnu.ShowSTInfo.push(dxModel);
                break;
            case 3:
                var wtModel = new sxnu.wdST_Model(Te_STMode.wt_ID, showNumber, Te_STMode.wt_Type);
                wtModel.Title(Te_STMode.wt_Title);
                wtModel.Time(Te_STMode.wt_LimitTime);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    wtModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });

                var item = JSON.parse(Te_STMode.wt_Options);  // cl 内容长度   o 是否在线   c 是否自定义答案条数   u 是否可以上传附件 
                var an3 = JSON.parse(Te_STMode.an_Result == "" ? "[]" : Te_STMode.an_Result);
                wtModel.Contentlength(item.cl);
                wtModel.IsOnline(item.o);
                wtModel.Customize(item.c);
                wtModel.IsUpload(item.u);
                wtModel.inputArray = ko.observableArray([]);

                $.each(an3, function (v, b) {
                    if (v == 0) {
                        wtModel.Ansure_Content(b);
                    }
                    wtModel.inputArray.push({ txt: b });
                });
                //wtModel.inputArray.push({ txt: "" });
                //wtModel.inputArray.push({ txt: "" });


                if (Te_STMode.an_leapfrog == "y") {
                    wtModel.jy(false);
                    wtModel.msg(sxnu.stWareMsg.relation);
                }
                sxnu.ShowSTInfo.push(wtModel);
                break;
            case 4:
                var zhModel = new sxnu.zhST_Model(Te_STMode.wt_ID, showNumber, Te_STMode.wt_Type);
                zhModel.Title(Te_STMode.wt_Title);
                zhModel.Time(Te_STMode.wt_LimitTime);
                zhModel.st_GaiYao(Te_STMode.wt_Options);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    zhModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });
                sxnu.ShowSTInfo.push(zhModel);
                break;
            case 5:
                var bgModel = new sxnu.bgST_Model(Te_STMode.wt_ID, showNumber, Te_STMode.wt_Type);
                bgModel.Title(Te_STMode.wt_Title);
                bgModel.Time(Te_STMode.wt_LimitTime);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    bgModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });
                var an5 = JSON.parse(Te_STMode.an_Result == "" ? "[]" : Te_STMode.an_Result);
                var item_at = JSON.parse(Te_STMode.wt_Options);
                $.each(item_at.t, function (i, val) {
                    var temp = new sxnu.m_t_5(val);
                    temp.ck(an5[i]);
                    if (Te_STMode.an_leapfrog == "y") {
                        temp.jy(false);
                    }
                    temp.name = Math.random(0, 1).toString().replace('.', '');
                    bgModel.TitleLsit.push(temp);
                });
                $.each(item_at.a, function (i, val) {
                    bgModel.AnswerList.push(new sxnu.m_a_5(val.t, val.f));
                });

                if (Te_STMode.an_leapfrog == "y") {
                    bgModel.msg(sxnu.stWareMsg.relation);
                }
                sxnu.ShowSTInfo.push(bgModel);
                break;
        }
    }

    // 试题 编号 试题展示 
    sxnu.pv_Path = ko.observable("");

    sxnu.item_model = function (item, fz) {
        this.hs_pv = ko.observable(false);
        this.id = ko.observable(("vp" + Math.random(1, 10000)).replace('.', ''));
        this.item = ko.observable(item);
        this.fz = ko.observable(fz);
        this.pv = ko.observableArray([]);
        this.ck = ko.observable("");
        this.ov = ko.observable("");
        this.r = ko.observable(0);
    }
    sxnu.ShowSTInfo = ko.observableArray();  //  展示试题信息的数组对象
    sxnu.ddxST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);
        this.Title_pic_vido = ko.observableArray();

        this.wt_LimitTime = ko.observable();
        this.wt_Title = ko.observable();
        this.wt_Problem = ko.observableArray();
        this.wt_Options = ko.observableArray();
        this.wt_OtherItem = ko.observableArray();
        this.wt_LogicRelated = ko.observable("");
        this.IsExpire = ko.observable(false);
        this.answer = ko.observable("");
        this.ov = ko.observable("");

        this.jy = ko.observable(true); // 禁用
        this.msg = ko.observable(""); // 消息提示
    }
    sxnu.wdST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);

        this.Title_pic_vido = ko.observableArray();
        this.Title = ko.observable("");
        this.Time = ko.observable(0);

        this.Ansure_Content = ko.observable("");
        this.Contentlength = ko.observable(0);
        this.Clac_Len = ko.observable(0);
        this.IsOnline = ko.observable(0);
        this.Customize = ko.observable(0);
        this.IsUpload = ko.observable(0);
        this.inputArray = ko.observableArray([]);
        this.IsExpire = ko.observable(false);
        this.Clac_Len = ko.computed(function () {
            if (parseInt(this.Contentlength()) != 0) {
                if (this.Ansure_Content().length > parseInt(this.Contentlength())) {
                    var str = this.Ansure_Content().substr(0, this.Contentlength());
                    this.Ansure_Content(str);
                    return 0;
                } else {
                    return parseInt(this.Contentlength()) - this.Ansure_Content().length;
                }
            } else {
                return this.Ansure_Content().length;
            }
        }, this);
        this.Add_wdSTItem = function (val) {
            val.inputArray.push({ txt: "" });
        };
        this.Del_wdSTItem = function (val, v) {
            if (val.inputArray().length == 1) {
                return false;
            }
            val.inputArray.remove(v);
        };

        this.jy = ko.observable(true); // 禁用
        this.msg = ko.observable(""); // 消息提示
    }
    sxnu.zhST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);

        this.Title_pic_vido = ko.observableArray();
        this.Title = ko.observable();
        this.Time = ko.observable(0);
        this.st_GaiYao = ko.observable();
        this.IsExpire = ko.observable(false);

        this.jy = ko.observable(true); // 禁用
        this.msg = ko.observable(""); // 消息提示
    }
    sxnu.bgST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);

        this.Title_pic_vido = ko.observableArray();
        this.Title = ko.observable("");
        this.Time = ko.observable(0);
        this.TitleLsit = ko.observableArray();
        this.AnswerList = ko.observableArray();
        this.IsExpire = ko.observable(false);


        this.msg = ko.observable(""); // 消息提示
    }
    sxnu.m_t_5 = function (t) {
        this.t = ko.observable(t);
        this.f = ko.observable(0);
        this.ck = ko.observable("");
        this.getF = function (val) {
            this.f(val.f());
        };
        this.jy = ko.observable(true); // 禁用

    }
    sxnu.m_a_5 = function (a, f) {
        this.a = ko.observable(a);
        this.f = ko.observable(f);
    }


    //===========================================试题展示信息 以及 试题编号=== 结束=====================

    sxnu.CloseConfirm = function (val) {
        $("#conifmNextPage").dialog('close');
    }
    sxnu.finishWT = function () {
        window.location.href = "/Home/Index";
    }
    sxnu.ShowSubmitedInfo = function (val) {
        $("#wj_finish").dialog({
            resizable: false,
            closeOnEscape: false,
            open: function (event, ui) { $(".ui-dialog-titlebar-close").hide(); },
            height: 300,
            width: 500,
            modal: true
        });
    }

    sxnu.ShowConfirm = function (val) {
        $("#conifmNextPage").dialog({
            resizable: false,
            height: 300,
            width: 500,
            modal: true
        });
    }
    sxnu.StartRelation = function (parent, item) {
        var currShowNum = parseFloat(parent.ShowNum());
        var dbid = item.r();
        if (item.r()) {  // 有逻辑关系
            $.each(sxnu.ShowSTInfo(), function (i, v) {
                if (v.dbID() == dbid) {
                    return false;
                }
                if (parseFloat(v.ShowNum()) > currShowNum) {
                    if (v.type() == 5) {
                        $.each(v.TitleLsit(), function (ti, titem) {
                            titem.jy(false);  //开始跳过试题
                        });
                    } else {
                        v.jy(false);
                    }
                    v.msg(sxnu.stWareMsg.relation); // 显示跳转信息
                }
            });
        } else { // 没有逻辑关系
            $.each(sxnu.ShowSTInfo(), function (i, v) {
                if (v.dbID() == dbid) {
                    return false;
                }
                if (parseFloat(v.ShowNum()) > currShowNum) {
                    if (v.type() == 5) {
                        $.each(v.TitleLsit(), function (ti, titem) {
                            titem.jy(true);
                        });
                    } else {
                        v.jy(true);
                    }
                    v.msg("");
                }
            });
        }
    }
    //    1  点击下一页的时候   2点击提交问卷的时候
    sxnu.NextPageWT = function () {
        sxnu.SaveAnswer(1);
    }

    sxnu.SubmitedWJ = function () {
        sxnu.SaveAnswer(2);
    }

    var Test = function (r, i, l, w) {
        this.an_Result = r;
        this.an_Invalid = i;
        this.an_leapfrog = l;
        this.an_wtType = w;
    }


    sxnu.SaveAnswer = function (status) {
        var listArray = [];
        var flag = true;
        var errorMsg = "";

        var CommonMode = {
            au_Time: sxnu.Answer_Time(),
            an_auID: sxnu.au_id(),
            dataArrayStr: ""
        };


        //$.each(sxnu.ShowSTInfo(), function (index, item) {
        //    var Save_Model = {
        //        an_Result: "",
        //        an_Invalid: "",
        //        an_leapfrog: "",
        //        an_wtType: "",
        //        an_wtID: 0
        //    };
        //    Save_Model.an_wtType = item.type();
        //    Save_Model.an_wtID = item.dbID();
        //    switch (parseInt(item.type())) {
        //        case 1:

        //            //var ansewer_1 = JSON.parse();
        //            if (!item.jy()) {
        //                Save_Model.an_leapfrog = "y";
        //                Save_Model.an_Result = "";
        //            } else {
        //                if (item.answer()) {
        //                    $.each(item.wt_OtherItem(), function (a, b) {
        //                        if (b.item() == item.answer()) {
        //                            if (!$.trim(item.ov())) {
        //                                flag = false;
        //                                errorMsg = "请输入试题 " + item.ShowNum() + " 的答案！";
        //                                return false;
        //                            }
        //                        }
        //                    })
        //                } else {
        //                    flag = false;
        //                    errorMsg = "请选择试题 " + item.ShowNum() + " 的答案！";
        //                    return false;
        //                }
        //                var strObj = { an: item.answer(), ov: item.ov() };
        //                Save_Model.an_Result = JSON.stringify(strObj);
        //            }



        //            break;
        //        case 2:
        //            if (!item.jy()) {
        //                Save_Model.an_leapfrog = "y";
        //                Save_Model.an_Result = "";
        //            } else {
        //                var duo2 = [];
        //                $.each(item.wt_Options(), function (i, v) {
        //                    if (v.ck()) {
        //                        duo2.push({ an: v.item(), ov: "" });
        //                    }
        //                });

        //                $.each(item.wt_OtherItem(), function (i, v) {
        //                    if (v.ck()) {
        //                        if ($.trim(v.ov())) {
        //                            duo2.push({ an: v.item(), ov: v.ov() });
        //                        } else {
        //                            flag = false;
        //                            errorMsg = "请输入试题 " + item.ShowNum() + " 的答案！";
        //                            return false;
        //                        }
        //                    }
        //                });
        //                if (duo2.length == 0) {
        //                    flag = false;
        //                    errorMsg = "请选择试题 " + item.ShowNum() + " 的答案！";
        //                    return false;
        //                }
        //                Save_Model.an_Result = JSON.stringify(duo2);
        //            }

        //            break;
        //        case 3:
        //            if (!item.jy()) {
        //                Save_Model.an_leapfrog = "y";
        //                Save_Model.an_Result = "";
        //            } else {
        //                var wd3 = [];
        //                if (item.Customize() == '1') {
        //                    $.each(item.inputArray(), function (i, v) {
        //                        if (!$.trim(v.txt)) {
        //                            flag = false;
        //                            errorMsg = "请输入试题 " + item.ShowNum() + " 的答案！";
        //                            return false;
        //                        } else {
        //                            wd3.push(v.txt);
        //                        }
        //                    });
        //                }

        //                if (item.IsOnline() == '1' && item.Customize() == '0') {
        //                    if (!$.trim(item.Ansure_Content())) {
        //                        flag = false;
        //                        errorMsg = "请输入试题 " + item.ShowNum() + " 的答案！";
        //                        return false;
        //                    } else {
        //                        wd3.push(item.Ansure_Content());
        //                    }
        //                }
        //                Save_Model.an_Result = JSON.stringify(wd3);
        //            }
        //            break;
        //        case 4:
        //            if (!item.jy()) {
        //                Save_Model.an_leapfrog = "y";
        //                Save_Model.an_Result = "";
        //            } else {
        //                Save_Model.an_Result = "";
        //            }

        //            break;
        //        case 5:
        //            var isGo = item.TitleLsit()[0].jy();
        //            if (!isGo) {
        //                Save_Model.an_leapfrog = "y";
        //                Save_Model.an_Result = "";
        //            } else {
        //                var bg5 = [];
        //                $.each(item.TitleLsit(), function (i, v) {
        //                    if (!v.ck()) {
        //                        flag = false;
        //                        errorMsg = "请选择试题 " + item.ShowNum() + " 的  " + v.t() + " 答案！";
        //                        return false;
        //                    } else {
        //                        bg5.push(v.ck());
        //                    }
        //                });
        //                Save_Model.an_Result = JSON.stringify(bg5);
        //            }
        //            break;

        //    }
        //    if (!flag) {
        //        return false;
        //    }
        //    listArray.push(Save_Model);
        //});

        //if (!flag) {
        //    alert(errorMsg);
        //    return false;
        //} else {
        //CommonMode.dataArrayStr = JSON.stringify(listArray);

        //var currentCount = sxnu.ShowSTInfo().length;
        //sxnu.Globle_STList().splice(0, currentCount);

        //$.each(sxnu.Globle_STList(), function (index, item) {
        //    if (item.wt_Pageing == "y") {
        //        sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
        //        return false;
        //    }
        //    sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
        //});
        //sxnu.CloseConfirm();
        //sxnu.PageCount(sxnu.PageCount() - 1);




    }

    sxnu.NextP = function () {
        if (sxnu.CurrentEnd_num() < sxnu.MaxNum()) {
            sxnu.ShowSTInfo.removeAll();
            $.each(sxnu.Globle_STList(), function (index, item) {
                if (parseFloat(item.wt_OrderNum) > sxnu.CurrentEnd_num()) {
                    if (item.wt_Pageing == "y") {
                        sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
                        return false;
                    }
                    sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
                }
            });
            sxnu.GetPageCount();
        }
    }
    sxnu.GoPage = function (val) {
        sxnu.ShowSTInfo.removeAll();
        $.each(sxnu.Globle_STList(), function (index, item) {
            var temp_V = parseFloat(item.wt_OrderNum);
            if (temp_V >= val.start && temp_V <= val.end) {
                sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
                if (item.wt_Pageing == "y") {
                    console.log(item.wt_OrderNum);
                }
            }
        });
        $("#pageListNum :button").removeClass("page_bck");
        $("#pageListNum :input[name='" + val.na + "']").addClass("page_bck");

    }
    sxnu.PageNum = ko.observableArray([]);
    sxnu.GetPageCount = function () {
        var temparray = [];
        temparray.push(1);
        $.each(sxnu.Globle_STList(), function (index, item) {
            if (item.wt_Pageing == "y") {
                if (index < sxnu.Globle_STList().length - 1) {
                    var end = item.wt_OrderNum;
                    temparray.push(parseFloat(end));
                    var start = sxnu.Globle_STList()[index + 1].wt_OrderNum;
                    temparray.push(parseFloat(start));
                }
            }
        });
        temparray.push(sxnu.MaxNum());
        for (var a = 0; a < temparray.length ; a++) {
            if (a % 2 == 0) {
                sxnu.PageNum.push({ num: a, start: temparray[a], end: temparray[a + 1], na: 'gopage' + a });
            }
        }
    }

    // 分页
    sxnu.CurrentStart_num = ko.observable(0);
    sxnu.CurrentEnd_num = ko.observable(0);
    sxnu.MaxNum = ko.observable(0);

    sxnu.AnswerName = ko.observable("");
    sxnu.BaseInfo = ko.observableArray([]);
    sxnu.PageCount = ko.observable(0);
    sxnu.TotalWJ = ko.observable(0);
    sxnu.ST_NumList = ko.observableArray();
    sxnu.subNumList = ko.observableArray();
    sxnu.Globle_STList = ko.observableArray();
    sxnu.Load_ST_List = function () {
        $("body").mask("正在加载.......");
        if (sxnu.wj_ID() != 0) {
            $.ajax("/Ques/GetAnswerFinish", { async: true, type: "GET", cache: true, data: { wjid: sxnu.wj_ID(), auid: sxnu.au_id() }, dataType: "json", }).then(function (result) {
                if (result) {
                    sxnu.TotalWJ(result.aw.length);
                    var par_num = 1;
                    $.each(result.aw, function (i, v) {
                        if (v.wt_PID != 0) {
                            sxnu.subNumList.push(v); // 记录子级试题
                        } else {
                            v.wt_OrderNum = par_num;
                            sxnu.ST_NumList.push(v);
                            par_num++;
                        }
                        if (v.wt_Pageing == "y") {
                            sxnu.PageCount(parseInt(sxnu.PageCount()) + 1);
                        }
                    });
                    sxnu.MaxNum(par_num - 1);
                    // 规整所有试题的编号
                    $.each(sxnu.ST_NumList(), function (i, v) {
                        sxnu.Globle_STList.push(v);
                        if (v.wt_Type == 4) {
                            var num = 1;
                            $.each(sxnu.subNumList(), function (i1, item) {
                                if (v.wt_ID == item.wt_PID) {
                                    item.wt_OrderNum = v.wt_OrderNum + "." + num;
                                    sxnu.Globle_STList.push(item);
                                    num++
                                }
                            });
                            num = 1;
                        }
                    });
                    // 页面加载的时候初始化试题第一页
                    $.each(sxnu.Globle_STList(), function (index, item) {
                        if (item.wt_Pageing == "y") {
                            sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
                            return false;
                        }
                        sxnu.ShowSTByLoccation(item, item.wt_OrderNum);
                    });

                    sxnu.GetPageCount();  //  获取当前试题的第一个和最后一个编号 用来分页

                    sxnu.AnswerName(result.Name);
                    sxnu.BaseInfo(result.baseinfo);
                    sxnu.AnswerTime((Math.floor(parseInt(result.time) / 60) + '分' + (parseInt(result.time) - (Math.floor(parseInt(result.time) / 60) * 60)) + '秒'));
                    $("body").unmask();
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }

    //======  记录时间的计时器
    sxnu.g_id = ko.observable(0);
    sxnu.intDiff = ko.observable(parseInt($("#wj_time").val()) * 60); //倒计时总秒数量
    sxnu.Answer_Time = ko.observable(0);
    //======


    sxnu.PageInit = function () {
        //$(window).bind('beforeunload', function () {
        //    return '你确认要离开本页面吗？';
        //});
        sxnu.wj_ID($("#wj_id").val());
        sxnu.au_id($("#au_id").val());
        sxnu.pv_Path("/WJ_Attachment/" + $("#wj_id").val() + "/");


        sxnu.Load_ST_List();
    }
    sxnu.PageInit();


}