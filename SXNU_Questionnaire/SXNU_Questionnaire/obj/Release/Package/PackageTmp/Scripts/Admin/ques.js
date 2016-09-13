
var SXNU_ViewModel_Ques1 = function ($, currentDom) {
    var sxnu = currentDom || this;
    //====== 开始step2=======================
    sxnu.ControlsType = ko.observableArray(["文本框", "单选按钮", "下拉菜单"]);
    sxnu.EnumControlsType = {
        wbk: "文本框",
        dxan: "单选按钮",
        xlcd: "下拉菜单"
    }
    sxnu.wj_ID = ko.observable(0);
    sxnu.Temp_User = ko.observable();
    sxnu.SearchValue = ko.observable("");
    sxnu.ValidStart = ko.observable();
    sxnu.ValidEnd = ko.observable();
    sxnu.IsExitisFile = ko.observable(false);
    sxnu.ValidStart.subscribe(function (val) {
        $("#ValidEnd").datepicker("option", "minDate", val);
    });
    sxnu.ValidEnd.subscribe(function (val) {
        $("#ValidStart").datepicker("option", "maxDate", val);
    });


    sxnu.Submited_Step1 = function () {
        var wj_Title = $("[name='wj_Title']").val();
        var wj_ProjectSource = $("[name='wj_ProjectSource']").val();
        var wj_Time = $("[name='wj_Time']").val();
        var wj_BeginBody = $("[name='wj_BeginBody']").val();
        if (!$.trim(wj_Title) || !$.trim(wj_BeginBody)) {
            alert("问卷信息不完整！");
            return false;
        }
        if ($.trim(wj_Time) != "") {
            if (!sxnu.IsNumber($.trim(wj_Time))) {
                alert("问卷时间格式不正确");
                return false;
            }
        }

        if (!sxnu.ValidStart() || !sxnu.ValidEnd()) {
            alert("请设置问卷有效期！");
            return false;
        }
        //if (!sxnu.IsExitisFile()) {
        //    alert("请选择问卷封面图片");
        //    return false;
        //}
        return true;
    }

    sxnu.ViewImg = function () {
        $("input[name='front_cover']").on("change", function () {
            var file = this.files[0];
            if (this.files && file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("#front_cover_view").attr("src", e.target.result);
                    sxnu.IsExitisFile(true);
                    //$("#fn").text(file.name);
                    //$("#fs").text(file.size + "bytes");
                }
                reader.readAsDataURL(file);
            }
        });
    }




    sxnu.InvaildStr = function (val) {
        var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.IsNumber = function (val) {
        var patrn = /^\+?[1-9][0-9]*$/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }




    sxnu.UploadImg = function () {
        $("#FrontCover").click();
    }

    sxnu.LoadWJ = function () {
        if (sxnu.wj_ID() != 0) {
            $.ajax("/Admin/Question/GetWJByID", { async: true, type: "GET", cache: true, data: { ID: sxnu.wj_ID() }, dataType: "json", }).then(function (result) {
                if (result) {
                    $('input[name="wj_Title"]').val(result[0].wj_Title);
                    $('input[name="wj_ProjectSource"]').val(result[0].wj_ProjectSource);
                    $('input[name="wj_Time"]').val(result[0].wj_Time);
                    sxnu.ValidStart(result[0].wj_ValidStart);
                    sxnu.ValidEnd(result[0].wj_ValidEnd);
                    $('textarea[name="wj_BeginBody"]').html(result[0].wj_BeginBody);
                    if (result[0].wj_BeginPic) {
                        $("#front_cover_view").attr('src', ("/WJ_Attachment/" + sxnu.wj_ID() + "/" + result[0].wj_BeginPic));
                        $("#WJ_fm").val(result[0].wj_BeginPic);
                    } else {
                        $("#front_cover_view").attr('src', "/Content/images/admin/1.jpg");
                        $("#WJ_fm").val("");
                    }
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.PageInit = function () {
        $("#ValidStart").datepicker({ dateFormat: 'yy-mm-dd' });
        $("#ValidEnd").datepicker({ dateFormat: 'yy-mm-dd' });
        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.LoadWJ();
        sxnu.ViewImg();
    }
    sxnu.PageInit();


}
var SXNU_ViewModel_Ques2 = function ($, currentDom) {
    var sxnu = currentDom || this;


    //====== 开始step2=======================
    sxnu.ControlsType = ko.observableArray(["文本框", "单选按钮", "下拉菜单"]);
    sxnu.EnumControlsType = {
        wbk: "文本框",
        dxan: "单选按钮",
        xlcd: "下拉菜单"
    }
    sxnu.name_ck = ko.observable("1");
    sxnu.s2_DataArray = ko.observableArray();

    sxnu.bim = function (title, type, rule, ck) {
        this.id = "";
        this.b1 = ko.observable(title);
        this.b2 = ko.observable(type);
        this.b3 = ko.observable(rule);
        this.nid = Math.random(1, 1000);
        this.ck = ko.observable(ck);

        this.del = function (val) {
            //var l = sxnu.s2_DataArray().length;
            //for (var i = l; i > 0; i--) {
            //   sxnu.s2_DataArray.remove(sxnu.s2_DataArray()[i - 1]);

            //}
            //if (sxnu.s2_DataArray().length == 1) { return; }
            sxnu.s2_DataArray.remove(val);

        }
        this.add = function (val) {
            if (sxnu.s2_DataArray().length <= 1 || val.id == undefined) {
                sxnu.s2_DataArray.push(new sxnu.bim("", "", "", "0"));
            } else {
                var Temp = [];
                $.each(sxnu.s2_DataArray(), function (i, item) {
                    Temp.push(item);
                    if (i == val.id) {
                        Temp.push(new sxnu.bim("", "", "", "0"));
                    }
                });
                sxnu.s2_DataArray(Temp);
            }
        }
        this.up = function (val) {
            if (val.id == 0) { return; }
            var Temp = [];
            var t_m; //上一个元素
            $.each(sxnu.s2_DataArray(), function (i, item) {
                if (i == val.id) {
                    t_m = Temp.pop();
                    Temp.push(item);
                    Temp.push(t_m);
                } else {
                    Temp.push(item);
                }
            });
            sxnu.s2_DataArray(Temp);

        }
        this.down = function (val) {
            if (sxnu.s2_DataArray().length == 1 || (sxnu.s2_DataArray().length - 1) == val.id) {
                return;
            }

            var Temp = [];
            var currnt_model;
            $.each(sxnu.s2_DataArray(), function (i, item) {
                Temp.push(item);
            });
            currnt_model = Temp[val.id];
            Temp[val.id] = Temp[val.id + 1];
            Temp[val.id + 1] = currnt_model;
            sxnu.s2_DataArray(Temp);
        }

    };

    sxnu.Validate_Step2 = function () {
        var result = true;
        $.each(sxnu.s2_DataArray(), function (i, item) {
            if (!item.b1()) {
                result = false;
                return false;
            }
            //if (item.b2() == sxnu.EnumControlsType.wbk) {
            //    if (!sxnu.IsNumber(item.b3())) {
            //        result = false;
            //        return false;
            //    }
            //}
            if (item.b2() == sxnu.EnumControlsType.dxan) {
                if (!item.b3()) {
                    result = false;
                    return false;
                }
            }
            if (item.b2() == sxnu.EnumControlsType.xlcd) {
                if (!item.b3()) {
                    result = false;
                    return false;
                }
            }
        });
        return result;

    }

    //sxnu.s2_DataArray.push(new sxnu.bim("字段", "单选按钮", "xxx字段xxx", "0"));
    //sxnu.s2_DataArray.push(new sxnu.bim("字段", "下拉菜单", "111x字段xxxx", "0"));
    //sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "111111111xxxxxxx字段xxxxxxxxxxxxxxx字段xxxxxxxxxxxxx111111字段111", "0"));
    //sxnu.s2_DataArray.push(new sxnu.bim("1字段", "下拉菜单", "1111111", "0"));
    //sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "1xxxxxxxxxxxxx", "0"));
    //sxnu.s2_DataArray.push(new sxnu.bim("1字段", "下拉菜单", "1xx字段xxx", "0"));
    //sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "1xxxxxxx字段xxxxxxxxx", "0"));
    //sxnu.s2_DataArray.push(new sxnu.bim("字段1", "下拉菜单", "1xxxxxxxx字段xxx", "0"));
    //sxnu.s2_DataArray.push(new sxnu.bim("字段1字段", "单选按钮", "11xxxxx字段xxxxx", "0"));


    // ======结束step2========================







    sxnu.wj_ID = ko.observable(0);





    sxnu.InvaildStr = function (val) {
        var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.IsNumber = function (val) {
        var flag = false;
        var patrn = /^\+?[1-9][0-9]*$/;
        if (val) {
            if (patrn.test(val)) {
                flag = true;
            } else { flag = false; }
        } else {
            flag = true;
        }

        return flag;
    }

    sxnu.Submited_Step2 = function () {
        if (!sxnu.Validate_Step2()) {
            alert("输入内容有误！");
            return false;
        }
        var baseInfo = new Array();
        $.each(sxnu.s2_DataArray(), function (index, item) {
            baseInfo.push({ tit: item.b1(), ty: item.b2(), val: item.b3(), ck: item.ck() });
        });
        $.ajax("/Admin/Question/SubmitedStep2", { async: true, type: "POST", cache: false, data: { wj_ID: sxnu.wj_ID(), wj_PageSize: sxnu.name_ck(), wj_BaseInfo: JSON.stringify(baseInfo) }, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                alert("提交成功");
                window.location.href = "/Admin/Question/Step3?ID=" + sxnu.wj_ID();
            } else {
                alert("提交成功");
            }
        }).fail(function () {
            alert("提交失败！");
        });
    }
    sxnu.LoadWJ = function () {
        if (sxnu.wj_ID() != 0) {
            $.ajax("/Admin/Question/GetWJByID", { async: true, type: "GET", cache: true, data: { ID: sxnu.wj_ID() }, dataType: "json", }).then(function (result) {
                if (result) {
                    if (result[0].wj_BaseInfo) {
                        sxnu.s2_DataArray.removeAll();
                        var dataArray = $.parseJSON(result[0].wj_BaseInfo);
                        $.each(dataArray, function (index, item) {
                            sxnu.s2_DataArray.push(new sxnu.bim(item.tit, item.ty, item.val, item.ck));
                        });
                        sxnu.name_ck(result[0].wj_PageSize);
                    } else {
                        sxnu.s2_DataArray.push(new sxnu.bim("", "文本框", "", "0"));
                        sxnu.name_ck("1");
                    }
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.PageInit = function () {

        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.LoadWJ();


    }
    sxnu.PageInit();


}
///  类型3 说明  {"cl":"123","o":"1","c":"1","u":"1"}  
// cl 内容长度   o 是否在线   c 是否自定义答案条数   u 是否可以上传附件 
// 2016-07-19
var SXNU_ViewModel_Ques3 = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.wj_ID = ko.observable(0);
    sxnu.Globle_OrderNum = ko.observable(0);
    sxnu.g_picExt = [".jpg", ".png", ".gif"];  //(图片格式：jpg、png、gif格式，最佳尺寸130*130;
    sxnu.g_vidoExt = [".flv", ".mp4", ".avi", ".ogg"];   //视频格式：flv、mp4、avi格式，最大支持5M)
    sxnu.stType = {   //  数据库分别代表  1 2 3 4 5
        dx: "单选题",
        dux: "多选题",
        wd: "问答题",
        zh: "组合题",
        bg: "表格题"
    }



    //================== 单选题  开始==========

    sxnu.item_model = function (item, fz) {
        this.hs_pv = ko.observable(false);
        this.id = ko.observable(("vp" + Math.random(1, 10000)).replace('.', ''));
        this.item = ko.observable(item);
        this.fz = ko.observable(fz);
        this.pv = ko.observableArray([]);
    }

    sxnu.T_itmeID = ko.observable("");
    sxnu.T_otherID = ko.observable("");

    sxnu.SaveTM = ko.observable();
    sxnu.SaveTempModel = function (val) {
        sxnu.SaveTM(val);
        return true;
    }
    sxnu.ST_Type = ko.observable(1); //  数据库分别代表  1  2  3  4  5

    sxnu.Title = ko.observable("");
    sxnu.wd_Title = ko.observable("");
    sxnu.zuhe_Title = ko.observable("");
    sxnu.bg_Title = ko.observable("");
    sxnu.Title_pic_vido = ko.observableArray();
    sxnu.Time = ko.observable(0);

    sxnu.Item = ko.observableArray();
    sxnu.other = ko.observableArray();




    sxnu.Save_dx = function () {
        var flag = true;
        sxnu.ST_Type(1);
        //       Math.floor(33.99)
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_OrderNum: sxnu.Globle_OrderNum(),
            wt_Title: sxnu.Title(),
            wt_PID: 0,
            wt_LimitTime: sxnu.Time(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: "",
            wt_IsAnswer: "y",
            wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var ItemArray = new Array();
        var strArray = [];
        $.each(sxnu.Item(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [], r: "" };
            if (!$.trim(item.item()) || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });
        $.each(sxnu.other(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [], r: "" };
            if (!$.trim(item.item()) || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });

        if (!flag) {
            alert("输入信息有误！");
            return false;
        }
        if (!sxnu.Title().trim() || sxnu.Item().length < 1 || !sxnu.IsFZandTime(sxnu.Time())) {
            alert("输入信息有误！");
            return false;
        }
        if (IsRepeat(strArray)) {
            alert("不能添加重复项！");
            return false;
        }
        fromDataModel.wt_Options = JSON.stringify(ItemArray);
        sxnu.Save_Ajax(fromDataModel);

    }
    sxnu.Save_Ajax = function (DataModel) {
        $.ajax("/Admin/Question/Save_ST", { async: true, type: "POST", cache: false, data: DataModel, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                alert("保存成功！");
                DataModel.wt_ID = result.ReturnADD_ID;
                sxnu.Globle_STList.push(DataModel);
                sxnu.Init(DataModel.wt_Type);
                sxnu.ST_NumList.push(new sxnu.ST_Model(result.ReturnADD_ID, sxnu.Globle_OrderNum(), DataModel.wt_Type));
                var temp = new sxnu.ST_Model(result.ReturnADD_ID, sxnu.Globle_OrderNum(), DataModel.wt_Type);
                sxnu.ShowSTByLoccation(temp);
                sxnu.Globle_OrderNum(sxnu.Globle_OrderNum() + 1);
            } else {
                alert("保存失败！");
            }
        }).fail(function () {
            alert("保存失败！");
        });
    }

    sxnu.IsShow_pv = function (val) {
        if (val.hs_pv()) {
            val.hs_pv(false);
        } else {
            val.hs_pv(true);
        }
    }

    sxnu.InvaildStr = function (val) {
        var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.IsNumber = function (val) {
        var patrn = /^\+?[1-9][0-9]*$/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.IsFZandTime = function (val) {
        var patrn = /^\+?[0-9]*$/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }

    sxnu.DeleteKOFile = function (val, type) {
        switch (sxnu.ST_Type()) {
            case 1:
                if (type == "t") {
                    sxnu.Title_pic_vido.remove(val);
                }
                if (type == "i") {
                    $.each(sxnu.Item(), function (i, item) {
                        $.each(sxnu.Item()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.Item()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                if (type == "o") {
                    $.each(sxnu.other(), function (i, item) {
                        $.each(sxnu.other()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.other()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                break;
            case 2:
                if (type == "t") {
                    sxnu.Title_pic_vido2.remove(val);
                }
                if (type == "i") {
                    $.each(sxnu.Item2(), function (i, item) {
                        $.each(sxnu.Item2()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.Item2()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                if (type == "o") {
                    $.each(sxnu.other2(), function (i, item) {
                        $.each(sxnu.other2()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.other2()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                break;
            case 3:
                sxnu.Title_pic_vido3.remove(val);
                break;
            case 4:
                sxnu.Title_pic_vido4.remove(val);
                break;
            case 5:
                sxnu.Title_pic_vido5.remove(val);
                break;

        }
    }

    sxnu.DeleteFileByServer = function (val, type) {
        var filePath = sxnu.wj_ID() + "/" + val.n
        $.ajax("/Admin/Question/DeleteFile", { async: true, type: "GET", cache: false, data: { FilePath: filePath }, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                sxnu.DeleteKOFile(val, type)
            } else {
                alert("删除失败");
            }
        })
    }
    sxnu.DelTitleFile = function (val) {
        sxnu.DeleteFileByServer(val, "t");
    }
    sxnu.DelItemFile = function (val) {
        sxnu.DeleteFileByServer(val, "i");
    }
    sxnu.DelOtherFile = function (val) {
        sxnu.DeleteFileByServer(val, "o");
    }

    sxnu.Delete_Item = function (val) {
        switch (sxnu.ST_Type()) {
            case 1:
                if (sxnu.Item().length == 1) {
                    return false;
                }
                sxnu.Item.remove(val);
                break;
            case 2:
                if (sxnu.Item2().length == 1) {
                    return false;
                }
                sxnu.Item2.remove(val);
                break;
            case 3:
                break;
            case 4:
                break;
        }


    }
    sxnu.Delete_OtherItem = function (val) {
        switch (sxnu.ST_Type()) {
            case 1:
                sxnu.other.remove(val);
                break;
            case 2:
                sxnu.other2.remove(val);
                break;
            case 3:
                break;
            case 4:
                break;
        }

    }
    sxnu.Add_Item = function () {
        var tm = new sxnu.item_model("", 0);
        switch (sxnu.ST_Type()) {
            case 1:
                sxnu.Item.push(tm);
                sxnu.T_itmeID(tm.id());
                sxnu.InitUploadContron(tm.id(), "i");
                break;
            case 2:
                sxnu.Item2.push(tm);
                sxnu.T_itmeID(tm.id());
                sxnu.InitUploadContron(tm.id(), "i");
                break;
            case 3:
                break;
            case 4:
                break;
        }



    }


    sxnu.Add_Other = function () {
        var tm = new sxnu.item_model("", 0);
        switch (sxnu.ST_Type()) {
            case 1:
                sxnu.other.push(tm);
                sxnu.T_otherID(tm.id());
                sxnu.InitUploadContron(tm.id(), "o");
                break;
            case 2:
                sxnu.other2.push(tm);
                sxnu.T_otherID(tm.id());
                sxnu.InitUploadContron(tm.id(), "o");
                break;
            case 3:
                break;
            case 4:
                break;
        }

    }
    //type  =   title   item   other
    sxnu.InitUploadContron = function (element_id, type) {
        var $ = jQuery,
        $list = $('#fileList'),
        ratio = window.devicePixelRatio || 1,
        uploader;
        uploader = WebUploader.create({
            auto: true,
            duplicate: true,
            prepareNextFile: true,
            fileSingleSizeLimit: 6 * 1024 * 1024,   // 50 M
            disableGlobalDnd: true,
            swf: '../../Scripts/uploader.swf',
            formData: {
                wjID: $("#WJ_ID").val(),
            },
            server: '/Admin/Question/SubmitedStep3',
            pick: '#' + element_id + '',
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,png,flv,mp4,avi,doc,docx,xlsx,xls,ogg,3gp'
            }
        });
        uploader.on('uploadSuccess', function (file, response) {
            fileExt = file.name.substr(file.name.lastIndexOf(".")).toLowerCase();
            switch (sxnu.ST_Type()) {
                case 1:
                    if (type == "t") {
                        if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                            sxnu.Title_pic_vido.push({ n: response.fileName, t: "p" });
                        }
                        if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                            sxnu.Title_pic_vido.push({ n: response.fileName, t: "v" });
                        }
                    }
                    if (type == "i") {
                        $.each(sxnu.Item(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.Item()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.Item()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    if (type == "o") {
                        $.each(sxnu.other(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.other()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.other()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    break;
                case 2:
                    if (type == "t") {
                        if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                            sxnu.Title_pic_vido2.push({ n: response.fileName, t: "p" });
                        }
                        if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                            sxnu.Title_pic_vido2.push({ n: response.fileName, t: "v" });
                        }
                    }
                    if (type == "i") {
                        $.each(sxnu.Item2(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.Item2()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.Item2()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    if (type == "o") {
                        $.each(sxnu.other2(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.other2()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.other2()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    break;
                case 3:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido3.push({ n: response.fileName, t: "p" });
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido3.push({ n: response.fileName, t: "v" });
                    }
                    break;
                case 4:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido4.push({ n: response.fileName, t: "p" });
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido4.push({ n: response.fileName, t: "v" });
                    }
                    break;
                case 5:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido5.push({ n: response.fileName, t: "p" });
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido5.push({ n: response.fileName, t: "v" });
                    }
                    break;
            }
        });
        uploader.on('fileQueued', function (file) {

        });
        uploader.on('uploadProgress', function (file, percentage) {

        });
        uploader.on('uploadError', function (file) {

        });
        uploader.on('uploadComplete', function (file) {

        });
        uploader.on("uploadFinished", function () {

        });
    }



    //==================单选题   结束===========




    //==================多选题   开始===========

    sxnu.Title2 = ko.observable("");
    sxnu.Time2 = ko.observable(0);
    sxnu.Title_pic_vido2 = ko.observableArray();
    sxnu.Item2 = ko.observableArray();
    sxnu.other2 = ko.observableArray();

    sxnu.Save_duox = function () {
        sxnu.ST_Type(2);
        var flag = true;
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title2(),
            wt_OrderNum: sxnu.Globle_OrderNum(),
            wt_PID: 0,
            wt_LimitTime: sxnu.Time2(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: "",
            wt_IsAnswer: "y",
            wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido2(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var ItemArray = new Array();
        var strArray = [];
        $.each(sxnu.Item2(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [], r: "" };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });
        $.each(sxnu.other2(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [], r: "" };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });

        if (!flag) {
            alert("输入信息有误！");
            return false;
        }
        if (!sxnu.Title2().trim() || sxnu.Item2().length < 1 || !sxnu.IsFZandTime(sxnu.Time2())) {
            alert("输入信息有误！");
            return false;
        }
        if (IsRepeat(strArray)) {
            alert("不能添加重复项！");
            return false;
        }
        fromDataModel.wt_Options = JSON.stringify(ItemArray);
        sxnu.Save_Ajax(fromDataModel);
    }
    //==================多选题   结束===========




    //==================问答题  开始===========


    sxnu.Title3 = ko.observable("");
    sxnu.Time3 = ko.observable(0);
    sxnu.Title_pic_vido3 = ko.observableArray();

    sxnu.Contentlength = ko.observable(0);
    sxnu.IsOnline = ko.observable("0");
    sxnu.Customize = ko.observable("0");
    sxnu.IsUpload = ko.observable("0");

    // 保存问答题
    sxnu.Save_wd = function () {
        sxnu.ST_Type(3);
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title3(),
            wt_OrderNum: sxnu.Globle_OrderNum(),
            wt_PID: 0,
            wt_LimitTime: sxnu.Time3(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: "",
            wt_IsAnswer: "y",
            wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido3(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var temp = { cl: sxnu.Contentlength(), o: sxnu.IsOnline(), c: sxnu.Customize(), u: sxnu.IsUpload() };  // 问答题辅助信息添加
        fromDataModel.wt_Options = JSON.stringify(temp);
        if (!sxnu.Title3().trim() || !sxnu.IsFZandTime(sxnu.Time3())) {
            alert("输入信息有误！");
            return false;
        }
        sxnu.Save_Ajax(fromDataModel);
    }
    //==================问答题   结束===========



    //==================组合题   开始=========== 

    sxnu.Title4 = ko.observable("");
    sxnu.st_GaiYao = ko.observable("");
    sxnu.Time4 = ko.observable(0);
    sxnu.Title_pic_vido4 = ko.observableArray();
    sxnu.Save_zh = function () {
        sxnu.ST_Type(4);
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title4(),
            wt_OrderNum: sxnu.Globle_OrderNum(),
            wt_PID: 0,
            wt_LimitTime: sxnu.Time4(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: sxnu.st_GaiYao(),
            wt_IsAnswer: "y",
            wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido3(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        if (!sxnu.Title4().trim() || !sxnu.IsFZandTime(sxnu.Time4())) {
            alert("输入信息有误！");
            return false;
        }
        //sxnu.Save_Ajax(fromDataModel);
        $.ajax("/Admin/Question/Save_ZHST", { async: true, type: "POST", cache: false, data: fromDataModel, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                alert("保存成功！");
                //sxnu.Init(DataModel.wt_Type);
                window.location.href = "/Admin/Question/Subst?ID=" + result.ReturnADD_ID + "&wjID=" + fromDataModel.wt_WJID;
            } else {
                alert("保存失败！");
            }
        }).fail(function () {
            alert("保存失败！");
        });
    }


    //==================组合题   结束=========== 




    //==================表格题   开始=========== 

    sxnu.m_t_5 = function (t) {
        this.t = ko.observable(t);
    }
    sxnu.m_a_5 = function (a, f) {
        this.a = ko.observable(a);
        this.f = ko.observable(f);
    }

    sxnu.Title5 = ko.observable("");
    sxnu.Time5 = ko.observable(0);
    sxnu.Title_pic_vido5 = ko.observableArray();
    sxnu.TitleLsit = ko.observableArray();
    sxnu.AnswerList = ko.observableArray();

    sxnu.add_Title5 = function () {
        sxnu.TitleLsit.push(new sxnu.m_t_5(""));
    }
    sxnu.del_Title5 = function (val) {
        sxnu.TitleLsit.remove(val);
    }

    sxnu.add_Answer5 = function () {
        sxnu.AnswerList.push(new sxnu.m_a_5("", 0));
    }
    sxnu.del_Answer5 = function (val) {
        sxnu.AnswerList.remove(val);
    }
    sxnu.Save_bg = function () {
        sxnu.ST_Type(5);
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title5(),
            wt_OrderNum: sxnu.Globle_OrderNum(),
            wt_PID: 0,
            wt_LimitTime: sxnu.Time5(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: "",
            wt_IsAnswer: "y",
            wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido5(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var bg = {
            t: [],
            a: []
        };
        var strArray = [];
        var flag = true;
        $.each(sxnu.TitleLsit(), function (i, item) {
            //var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!$.trim(item.t())) {
                flag = false;
            }
            bg.t.push($.trim(item.t()));
        });
        $.each(sxnu.AnswerList(), function (i, item) {
            //var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!$.trim(item.a()) || !sxnu.IsFZandTime(item.f())) {
                flag = false;
            }
            bg.a.push({ t: $.trim(item.a()), f: $.trim(item.f()) });
            strArray.push($.trim(item.a()));
        });
        if (!flag) {
            alert("输入信息有误！");
            return false;
        }
        if (!sxnu.Title5().trim() || !sxnu.IsFZandTime(sxnu.Time5())) {
            alert("输入信息有误！");
            return false;
        }
        if (IsRepeat(strArray) || IsRepeat(bg.t)) {
            alert("答案 或 内容项存在重复！");
            return false;
        }
        fromDataModel.wt_Options = JSON.stringify(bg);
        sxnu.Save_Ajax(fromDataModel);
    }

    //==================表格题   结束=========== 








    // commmon  ======



    sxnu.ViewImg = function (val) {
        var imgpath = "/WJ_Attachment/" + sxnu.wj_ID() + "/" + val.n;
        window.open(imgpath);
    }
    sxnu.Init = function (tx) {
        switch (tx) {
            case 1:

                sxnu.ST_Type(1);
                sxnu.Title("");
                sxnu.Time(0);
                sxnu.Title_pic_vido.removeAll();
                sxnu.Item.removeAll();
                sxnu.other.removeAll();
                sxnu.Add_Item();
                sxnu.Add_Other();
                sxnu.InitUploadContron("filePicker1", "t");
                break;
            case 2:
                sxnu.ST_Type(2);
                sxnu.Title2("");
                sxnu.Time2(0);
                sxnu.Title_pic_vido2.removeAll();
                sxnu.Item2.removeAll();
                sxnu.other2.removeAll();
                sxnu.Add_Item();
                sxnu.Add_Other();
                sxnu.InitUploadContron("filePicker2", "t");
                break;
            case 3:
                sxnu.ST_Type(3);
                sxnu.Title3("");
                sxnu.Time3(0);
                sxnu.Contentlength(0);
                sxnu.IsOnline(0);
                sxnu.Customize(0);
                sxnu.IsUpload(0);
                sxnu.Title_pic_vido3.removeAll();
                sxnu.InitUploadContron("filePicker3", "t");
                break;
            case 4:
                sxnu.ST_Type(4);
                sxnu.Title4("");
                sxnu.Time4(0);
                sxnu.Title_pic_vido4.removeAll();
                sxnu.InitUploadContron("filePicker4", "t");
                break;
            case 5:
                sxnu.ST_Type(5);
                sxnu.Title5("");
                sxnu.Time5(0);
                sxnu.Title_pic_vido5.removeAll();
                sxnu.TitleLsit.removeAll();
                sxnu.AnswerList.removeAll();
                sxnu.add_Title5();
                sxnu.add_Answer5();

                sxnu.InitUploadContron("filePicker5", "t");
                break;
        }

    }

    //===========================================试题展示信息 以及 试题编号=== 结束=====================

    sxnu.ShowSTByLoccation = function (val) {
        // 元素id  'StNum_'+dbID()
        var dbid = 0;
        var showNumber = "";
        $("#st_numLisr a").removeClass("wly_menber_hov");
        if ("subNum" in val) {
            $("#dbid_" + val.dbID()).addClass("wly_menber_hov");
            dbid = val.dbID();
            showNumber = val.ShowNum();
        } else {
            $("#dbid_" + val.dbID).addClass("wly_menber_hov");
            dbid = val.dbID;
            showNumber = val.ShowNum;
        }
        var Te_STMode;
        $.each(sxnu.Globle_STList(), function (index, item) {
            if (item.wt_ID == dbid) {
                Te_STMode = item;
                return;
            }
        });

        sxnu.ShowSTInfo.removeAll();
        switch (parseInt(Te_STMode.wt_Type)) {
            case 1:
                var dxModel = new sxnu.ddxST_Model(Te_STMode.wt_ID, showNumber, parseInt(Te_STMode.wt_Type));
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
                wtModel.inputArray = ko.observableArray();
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
        sxnu.Init_Vido();
    }
    sxnu.Init_Vido = function () {
        if (sxnu.ShowSTInfo().length > 0) {
            $.each(sxnu.ShowSTInfo(), function (pvindex, pv) {
                $.each(pv.Title_pic_vido(), function (subindex, subpv) {
                    if (subpv.t == "v") {
                        var id = subpv.n.replace('.', '');
                        var str = "<embed src='/Content/widget/ckplayer/ckplayer.swf' quality='high' wmode='transparent' align='middle' allowscriptaccess='always' allowfullscreen='true'";
                        str += "flashvars='" + sxnu.p_Path() + subpv.n + "&p=2' type='application/x-shockwave-flash' width='300' height='200' >";
                        $("#" + id).append(str);
                    }

                });
            });
        }
    }
    // 试题 编号 试题展示 
    sxnu.pv_Path = ko.observable("");

    sxnu.ST_Model = function (dbID, ShowNum, type) {
        this.subNum = ko.observableArray();
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);
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
        this.wt_LogicRelated = ko.observable();
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
        this.Clac_Len = ko.computed(function () {
            if (this.Ansure_Content().length > parseInt(this.Contentlength())) {
                var str = this.Ansure_Content().substr(0, this.Contentlength());
                this.Ansure_Content(str);
                return 0;
            } else {
                return parseInt(this.Contentlength()) - this.Ansure_Content().length;
            }
        }, this);
    }

    //===========================================试题展示信息 以及 试题编号=== 结束=====================


    sxnu.Add_wdSTItem = function () {
        sxnu.ShowSTInfo()[0].inputArray.push({ txt: "" });
    }
    sxnu.Del_wdSTItem = function (val) {
        if (sxnu.ShowSTInfo()[0].inputArray().length == 1) { return false; }
        sxnu.ShowSTInfo()[0].inputArray.remove(val);
    }


    sxnu.zhST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);

        this.Title_pic_vido = ko.observableArray();
        this.Title = ko.observable();
        this.Time = ko.observable(0);
        this.st_GaiYao = ko.observable();
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

    }


    ///======================test ===========================

    sxnu.ST_NumList = ko.observableArray();
    sxnu.subNumList = ko.observableArray();
    sxnu.Globle_STList = ko.observableArray();
    sxnu.Load_ST_List = function () {
        $("#MaskMain").mask("正在加载.......");
        if (sxnu.wj_ID() != 0) {
            $.ajax("/Admin/Question/GetSTBy_WJID", { async: true, type: "GET", cache: true, data: { ID: sxnu.wj_ID() }, dataType: "json", }).then(function (result) {
                if (result) {
                    var par_num = 1;
                    sxnu.Globle_STList(result);
                    $.each(result, function (i, v) {
                        if (v.wt_PID != 0) {
                            sxnu.subNumList.push(v); // 记录子级试题编号
                        } else {
                            var temp = new sxnu.ST_Model(v.wt_ID, par_num, v.wt_Type);
                            sxnu.ST_NumList.push(temp);
                            par_num++;
                        }
                    });
                    sxnu.Globle_OrderNum(sxnu.ST_NumList().length + 1);  // 记录最大一级试题编号 按顺序编号
                    $.each(sxnu.ST_NumList(), function (i, v) {
                        if (v.type() == 4) {
                            var num = 1;
                            $.each(sxnu.subNumList(), function (i1, item) {
                                if (v.dbID() == item.wt_PID) {
                                    v.subNum.push({ dbID: item.wt_ID, type: item.wt_Type, ShowNum: v.ShowNum() + "." + num });
                                    num++
                                }
                            });
                            num = 1;
                        }
                    });
                    $("#MaskMain").unmask();

                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }

    sxnu.p_Path = ko.observable();
    sxnu.PageInit = function () {

        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.pv_Path("/WJ_Attachment/" + $("#WJ_ID").val() + "/");
        sxnu.p_Path("f=../../../WJ_Attachment/" + $("#WJ_ID").val() + "/");
        $(".type ul li").click(function () {
            if (sxnu.Title_pic_vido().length > 1 || sxnu.Item().length > 2 || sxnu.other().length > 2) {
                if (confirm("你还没有保存当前数据.确定要放弃保存吗？")) {
                    $(".type ul li").removeClass("type_hover");
                    $(this).addClass("type_hover");
                    var Index = $(this).index();
                    $(".ti").hide();
                    $(".ti:eq(" + Index + ")").show();
                    sxnu.InitUploadContron("filePicker1", "t");
                }
            }
            else {
                $(".type ul li").removeClass("type_hover");
                $(this).addClass("type_hover");
                var Index = $(this).index();
                $(".ti").hide();
                $(".ti:eq(" + Index + ")").show();
                sxnu.InitUploadContron("filePicker1", "t");
            }
        })
        sxnu.Init(1);
        sxnu.Load_ST_List();


    }
    sxnu.PageInit();


}
var SXNU_ViewModel_sjSub = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.wj_ID = ko.observable(0);
    sxnu.Parent_OrderNum = ko.observable(0);
    sxnu.g_picExt = [".jpg", ".png", ".gif"];  //(图片格式：jpg、png、gif格式，最佳尺寸130*130;
    sxnu.g_vidoExt = [".flv", ".mp4", ".avi", ".ogg"];   //视频格式：flv、mp4、avi格式，最大支持5M)
    sxnu.stType = {   //  数据库分别代表  1 2 3 4 5
        dx: "单选题",
        dux: "多选题",
        wd: "问答题",
        zh: "组合题",
        bg: "表格题"
    }

  

    //================== 单选题  开始==========

    sxnu.item_model = function (item, fz) {
        this.hs_pv = ko.observable(false);
        this.id = ko.observable(("vp" + Math.random(1, 10000)).replace('.', ''));
        this.item = ko.observable(item);
        this.fz = ko.observable(fz);
        this.pv = ko.observableArray([]);
    }

    sxnu.T_itmeID = ko.observable("");
    sxnu.T_otherID = ko.observable("");

    sxnu.SaveTM = ko.observable();
    sxnu.SaveTempModel = function (val) {
        sxnu.SaveTM(val);
        return true;
    }
    sxnu.ST_Type = ko.observable(1); //  数据库分别代表  1  2  3  4  5

    sxnu.Title = ko.observable("");
    //sxnu.wd_Title = ko.observable("");
    //sxnu.zuhe_Title = ko.observable("");
    //sxnu.bg_Title = ko.observable("");
    sxnu.Title_pic_vido = ko.observableArray();
    sxnu.Time = ko.observable(0);

    sxnu.Item = ko.observableArray();
    sxnu.other = ko.observableArray();


    sxnu.IsShow_pv = function (val) {
        if (val.hs_pv()) {
            val.hs_pv(false);
        } else {
            val.hs_pv(true);
        }
    }

    sxnu.InvaildStr = function (val) {
        var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.IsNumber = function (val) {
        var patrn = /^\+?[1-9][0-9]*$/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.IsFZandTime = function (val) {
        var patrn = /^\+?[0-9]*$/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }

    sxnu.DeleteKOFile = function (val, type) {
        switch (sxnu.ST_Type()) {
            case 1:
                if (type == "t") {
                    sxnu.Title_pic_vido.remove(val);
                }
                if (type == "i") {
                    $.each(sxnu.Item(), function (i, item) {
                        $.each(sxnu.Item()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.Item()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                if (type == "o") {
                    $.each(sxnu.other(), function (i, item) {
                        $.each(sxnu.other()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.other()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                break;
            case 2:
                if (type == "t") {
                    sxnu.Title_pic_vido2.remove(val);
                }
                if (type == "i") {
                    $.each(sxnu.Item2(), function (i, item) {
                        $.each(sxnu.Item2()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.Item2()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                if (type == "o") {
                    $.each(sxnu.other2(), function (i, item) {
                        $.each(sxnu.other2()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.other2()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                break;
            case 3:
                sxnu.Title_pic_vido3.remove(val);
                break;
            case 4:
                sxnu.Title_pic_vido4.remove(val);
                break;
            case 5:
                sxnu.Title_pic_vido5.remove(val);
                break;

        }
    }

    sxnu.DeleteFileByServer = function (val, type) {
        var filePath = sxnu.wj_ID() + "/" + val.n
        $.ajax("/Admin/Question/DeleteFile", { async: true, type: "GET", cache: false, data: { FilePath: filePath }, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                sxnu.DeleteKOFile(val, type)
            } else {
                alert("删除失败");
            }
        })
    }
    sxnu.DelTitleFile = function (val) {
        sxnu.DeleteFileByServer(val, "t");
    }
    sxnu.DelItemFile = function (val) {
        sxnu.DeleteFileByServer(val, "i");
    }
    sxnu.DelOtherFile = function (val) {
        sxnu.DeleteFileByServer(val, "o");
    }

    sxnu.Delete_Item = function (val) {
        switch (sxnu.ST_Type()) {
            case 1:
                if (sxnu.Item().length == 1) {
                    return false;
                }
                sxnu.Item.remove(val);
                break;
            case 2:
                if (sxnu.Item2().length == 1) {
                    return false;
                }
                sxnu.Item2.remove(val);
                break;
                //case 3:
                //    break;
                //case 4:
                //    break;
        }


    }
    sxnu.Delete_OtherItem = function (val) {
        switch (sxnu.ST_Type()) {
            case 1:
                sxnu.other.remove(val);
                break;
            case 2:
                sxnu.other2.remove(val);
                break;
            case 3:
                break;
            case 4:
                break;
        }

    }
    sxnu.Add_Item = function () {
        var tm = new sxnu.item_model("", 0);
        switch (sxnu.ST_Type()) {
            case 1:
                sxnu.Item.push(tm);
                sxnu.T_itmeID(tm.id());
                sxnu.InitUploadContron(tm.id(), "i");
                break;
            case 2:
                sxnu.Item2.push(tm);
                sxnu.T_itmeID(tm.id());
                sxnu.InitUploadContron(tm.id(), "i");
                break;
            case 3:
                break;
            case 4:
                break;
        }



    }


    sxnu.Add_Other = function () {
        var tm = new sxnu.item_model("", 0);
        switch (sxnu.ST_Type()) {
            case 1:
                sxnu.other.push(tm);
                sxnu.T_otherID(tm.id());
                sxnu.InitUploadContron(tm.id(), "o");
                break;
            case 2:
                sxnu.other2.push(tm);
                sxnu.T_otherID(tm.id());
                sxnu.InitUploadContron(tm.id(), "o");
                break;
            case 3:
                break;
            case 4:
                break;
        }

    }
    //type  =   title   item   other
    sxnu.InitUploadContron = function (element_id, type) {
        var $ = jQuery,
        $list = $('#fileList'),
        ratio = window.devicePixelRatio || 1,
        uploader;
        uploader = WebUploader.create({
            auto: true,
            duplicate: true,
            prepareNextFile: true,
            fileSingleSizeLimit: 6 * 1024 * 1024,   // 50 M
            disableGlobalDnd: true,
            formData: {
                wjID: $("#WJ_ID").val(),
            },
            swf: '../../Scripts/uploader.swf',
            server: '/Admin/Question/SubmitedStep3',
            pick: '#' + element_id + '',
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,png,flv,mp4,avi,doc,docx,xlsx,xls,ogg,3gp'
            }
        });
        uploader.on('uploadSuccess', function (file, response) {
            fileExt = file.name.substr(file.name.lastIndexOf(".")).toLowerCase();
            switch (sxnu.ST_Type()) {
                case 1:
                    if (type == "t") {
                        if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                            sxnu.Title_pic_vido.push({ n: response.fileName, t: "p" });
                        }
                        if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                            sxnu.Title_pic_vido.push({ n: response.fileName, t: "v" });
                        }
                    }
                    if (type == "i") {
                        $.each(sxnu.Item(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.Item()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.Item()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    if (type == "o") {
                        $.each(sxnu.other(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.other()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.other()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    break;
                case 2:
                    if (type == "t") {
                        if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                            sxnu.Title_pic_vido2.push({ n: response.fileName, t: "p" });
                        }
                        if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                            sxnu.Title_pic_vido2.push({ n: response.fileName, t: "v" });
                        }
                    }
                    if (type == "i") {
                        $.each(sxnu.Item2(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.Item2()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.Item2()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    if (type == "o") {
                        $.each(sxnu.other2(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.other2()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.other2()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    break;
                case 3:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido3.push({ n: response.fileName, t: "p" });
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido3.push({ n: response.fileName, t: "v" });
                    }
                    break;
                case 4:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido4.push({ n: response.fileName, t: "p" });
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido4.push({ n: response.fileName, t: "v" });
                    }
                    break;
                case 5:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido5.push({ n: response.fileName, t: "p" });
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido5.push({ n: response.fileName, t: "v" });
                    }
                    break;
            }
        });
        uploader.on('fileQueued', function (file) {

        });
        uploader.on('uploadProgress', function (file, percentage) {

        });
        uploader.on('uploadError', function (file) {

        });
        uploader.on('uploadComplete', function (file) {

        });
        uploader.on("uploadFinished", function () {

        });
    }

    sxnu.Save_dx = function () {
        var flag = true;
        sxnu.ST_Type(1);
        var sunDbOrder = (sxnu.CurrentST_SubSTMaxNum() + 1) < 10 ? ".0" + (sxnu.CurrentST_SubSTMaxNum() + 1) : "." + (sxnu.CurrentST_SubSTMaxNum() + 1);
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title(),
            wt_OrderNum: sxnu.Parent_OrderNum() + "" + sunDbOrder,
            wt_PID: sxnu.ParentSJ_ID(),
            wt_LimitTime: sxnu.Time(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: "",
            wt_IsAnswer: "y",
            wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var ItemArray = new Array();
        var strArray = [];
        $.each(sxnu.Item(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [], r: "" };
            if (!$.trim(item.item()) || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });
        $.each(sxnu.other(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [], r: "" };
            if (!$.trim(item.item()) || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });
        fromDataModel.wt_Options = JSON.stringify(ItemArray);
        if (!flag) {
            alert("输入信息有误！");
            return false;
        }
        if (!sxnu.Title().trim() || sxnu.Item().length < 1 || !sxnu.IsFZandTime(sxnu.Time())) {
            alert("输入信息有误！");
            return false;
        }
        if (IsRepeat(strArray)) {
            alert("不能添加重复项！");
            return false;
        }
        sxnu.Save_Ajax(fromDataModel);

    }
    sxnu.Save_Ajax = function (DataModel) {
        $.ajax("/Admin/Question/Save_ST", { async: true, type: "POST", cache: false, data: DataModel, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                alert("保存成功！");
                DataModel.wt_ID = result.ReturnADD_ID;
                sxnu.Globle_STList.push(DataModel);
                sxnu.Init(DataModel.wt_Type);
                sxnu.subNumList.push(DataModel);
                sxnu.GetMaxSubList();
                var temp = { dbID: result.ReturnADD_ID, type: DataModel.wt_Type, ShowNum: sxnu.Parent_OrderNum() + '.' + (sxnu.CurrentST_SubSTMaxNum()) };
                sxnu.Load_ST_List(temp);
            } else {
                alert("保存失败！");
            }
        }).fail(function () {
            alert("保存失败！");
        });
    }

    //==================单选题   结束===========




    //==================多选题   开始===========

    sxnu.Title2 = ko.observable("");
    sxnu.Time2 = ko.observable(0);
    sxnu.Title_pic_vido2 = ko.observableArray();
    sxnu.Item2 = ko.observableArray();
    sxnu.other2 = ko.observableArray();

    sxnu.Save_duox = function () {
        sxnu.ST_Type(2);
        var flag = true;
        var sunDbOrder = (sxnu.CurrentST_SubSTMaxNum() + 1) < 10 ? ".0" + (sxnu.CurrentST_SubSTMaxNum() + 1) : "." + (sxnu.CurrentST_SubSTMaxNum() + 1)
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title2(),
            wt_OrderNum: sxnu.Parent_OrderNum() + "" + sunDbOrder,
            wt_PID: sxnu.ParentSJ_ID(),
            wt_LimitTime: sxnu.Time2(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: "",
            wt_IsAnswer: "y",
            wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido2(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var ItemArray = new Array();
        var strArray = [];
        $.each(sxnu.Item2(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [], r: "" };
            if (!$.trim(item.item()) || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });
        $.each(sxnu.other2(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [], r: "" };
            if (!$.trim(item.item()) || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });
        fromDataModel.wt_Options = JSON.stringify(ItemArray);
        if (!flag) {
            alert("输入信息有误！");
            return false;
        }
        if (!sxnu.Title2().trim() || sxnu.Item2().length < 1 || !sxnu.IsFZandTime(sxnu.Time2())) {
            alert("输入信息有误！");
            return false;
        }
        if (IsRepeat(strArray)) {
            alert("不能添加重复项！");
            return false;
        }
        sxnu.Save_Ajax(fromDataModel);
    }
    //==================多选题   结束===========




    //==================问答题  开始===========


    sxnu.Title3 = ko.observable("");
    sxnu.Time3 = ko.observable(0);
    sxnu.Title_pic_vido3 = ko.observableArray();

    sxnu.Contentlength = ko.observable(0);
    sxnu.IsOnline = ko.observable(0);
    sxnu.Customize = ko.observable(0);
    sxnu.IsUpload = ko.observable(0);

    // 保存问答题
    sxnu.Save_wd = function () {
        sxnu.ST_Type(3);
        var sunDbOrder = (sxnu.CurrentST_SubSTMaxNum() + 1) < 10 ? ".0" + (sxnu.CurrentST_SubSTMaxNum() + 1) : "." + (sxnu.CurrentST_SubSTMaxNum() + 1)
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title3(),
            wt_OrderNum: sxnu.Parent_OrderNum() + "" + sunDbOrder,
            wt_PID: sxnu.ParentSJ_ID(),
            wt_LimitTime: sxnu.Time3(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: "",
            wt_IsAnswer: "y",
            wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido3(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var temp = { cl: sxnu.Contentlength(), o: sxnu.IsOnline(), c: sxnu.Customize(), u: sxnu.IsUpload() };  // 问答题辅助信息添加
        fromDataModel.wt_Options = JSON.stringify(temp);
        if (!sxnu.Title3().trim() || !sxnu.IsFZandTime(sxnu.Time3())) {
            alert("输入信息有误！");
            return false;
        }
        sxnu.Save_Ajax(fromDataModel);
    }
    //==================问答题   结束===========



    //==================表格题   开始=========== 

    sxnu.m_t_5 = function (t) {
        this.t = ko.observable(t);
    }
    sxnu.m_a_5 = function (a, f) {
        this.a = ko.observable(a);
        this.f = ko.observable(f);
    }

    sxnu.Title5 = ko.observable("");
    sxnu.Time5 = ko.observable(0);
    sxnu.Title_pic_vido5 = ko.observableArray();
    sxnu.TitleLsit = ko.observableArray();
    sxnu.AnswerList = ko.observableArray();

    sxnu.add_Title5 = function () {
        sxnu.TitleLsit.push(new sxnu.m_t_5(""));
    }
    sxnu.del_Title5 = function (val) {
        sxnu.TitleLsit.remove(val);
    }

    sxnu.add_Answer5 = function () {
        sxnu.AnswerList.push(new sxnu.m_a_5("", 0));
    }
    sxnu.del_Answer5 = function (val) {
        sxnu.AnswerList.remove(val);
    }
    sxnu.Save_bg = function () {
        sxnu.ST_Type(5);
        var sunDbOrder = (sxnu.CurrentST_SubSTMaxNum() + 1) < 10 ? ".0" + (sxnu.CurrentST_SubSTMaxNum() + 1) : "." + (sxnu.CurrentST_SubSTMaxNum() + 1);
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title5(),
            wt_OrderNum: sxnu.Parent_OrderNum() + "" + sunDbOrder,
            wt_PID: sxnu.ParentSJ_ID(),
            wt_LimitTime: sxnu.Time5(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: "",
            wt_IsAnswer: "y",
            wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido5(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);

        var bg = {
            t: [],
            a: []
        };
        var flag = true;
        var strArray = [];
        $.each(sxnu.TitleLsit(), function (i, item) {
            //var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.t().trim()) {
                flag = false;
            }
            bg.t.push(item.t().trim());
        });
        $.each(sxnu.AnswerList(), function (i, item) {
            //var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!$.trim(item.a()) || !sxnu.IsFZandTime(item.f())) {
                flag = false;
            }
            bg.a.push({ t: $.trim(item.a()), f: $.trim(item.f()) });
            strArray.push($.trim(item.a()));
        });
        fromDataModel.wt_Options = JSON.stringify(bg);
        if (!flag) {
            alert("输入信息有误！");
            return false;
        }
        if (!sxnu.Title5().trim() || !sxnu.IsFZandTime(sxnu.Time5())) {
            alert("输入信息有误！");
            return false;
        }
        if (IsRepeat(strArray) || IsRepeat(bg.t)) {
            alert("答案 或 内容项存在重复！");
            return false;
        }
        sxnu.Save_Ajax(fromDataModel);
    }

    //==================表格题   结束=========== 








    // commmon  ======

    sxnu.Globle_STList = ko.observableArray();
    sxnu.ViewImg = function (val) {
        var imgpath = "/WJ_Attachment/" + sxnu.wj_ID() + "/" + val.n;
        window.open(imgpath);
    }


    sxnu.ParentSJ_ID = ko.observable(0);
    sxnu.Init = function (tx) {
        switch (tx) {
            case 1:

                sxnu.ST_Type(1);
                sxnu.Title("");
                sxnu.Time(0);
                sxnu.Title_pic_vido.removeAll();
                sxnu.Item.removeAll();
                sxnu.other.removeAll();
                sxnu.Add_Item();
                sxnu.Add_Other();
                sxnu.InitUploadContron("filePicker1", "t");
                break;
            case 2:
                sxnu.ST_Type(2);
                sxnu.Title2("");
                sxnu.Time2(0);
                sxnu.Title_pic_vido2.removeAll();
                sxnu.Item2.removeAll();
                sxnu.other2.removeAll();
                sxnu.Add_Item();
                sxnu.Add_Other();
                sxnu.InitUploadContron("filePicker2", "t");
                break;
            case 3:
                sxnu.ST_Type(3);
                sxnu.Title3("");
                sxnu.Time3(0);
                sxnu.Contentlength(0);
                sxnu.IsOnline(0);
                sxnu.Customize(0);
                sxnu.IsUpload(0);
                sxnu.Title_pic_vido3.removeAll();
                sxnu.InitUploadContron("filePicker3", "t");
                break;
            case 4:
                sxnu.ST_Type(4);
                sxnu.Title4("");
                sxnu.Time4(0);
                sxnu.Title_pic_vido4.removeAll();
                sxnu.InitUploadContron("filePicker4", "t");
                break;
            case 5:
                sxnu.ST_Type(5);
                sxnu.Title5("");
                sxnu.Time5(0);
                sxnu.Title_pic_vido5.removeAll();
                sxnu.TitleLsit.removeAll();
                sxnu.AnswerList.removeAll();
                sxnu.add_Title5();
                sxnu.add_Answer5();

                sxnu.InitUploadContron("filePicker5", "t");
                break;
        }

    }
    /////////////开始 获取是试题管理

    sxnu.IndexNum = ko.observable(0);  // 记录试题索引

    // 试题 编号 试题展示 
    sxnu.ST_Model = function (dbID, ShowNum, type) {
        this.subNum = ko.observableArray([]);
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);
    }
    sxnu.ST_NumList = ko.observableArray();
    sxnu.subNumList = ko.observableArray();

    // 获取当前父试题的子试题
    sxnu.CurrentST_SubSTMaxNum = ko.observable(0);
    sxnu.GetMaxSubList = function () {
        var maxNum = 0;
        $.each(sxnu.subNumList(), function (i, item) {
            if (item.wt_PID == sxnu.ParentSJ_ID()) {
                maxNum++;
            }
        });
        sxnu.CurrentST_SubSTMaxNum(maxNum);
    }



    sxnu.Load_ST_List = function (model) {
        if (sxnu.wj_ID() != 0) {
            $("#MaskMain").mask("正在加载.......");
            sxnu.Globle_STList.removeAll();
            sxnu.subNumList.removeAll();
            sxnu.ST_NumList.removeAll();
            $.ajax("/Admin/Question/GetSTBy_WJID", { async: true, type: "GET", cache: true, data: { ID: sxnu.wj_ID() }, dataType: "json", }).then(function (result) {
                if (result) {
                    sxnu.Globle_STList(result);
                    // 一级编号
                    var par_num = 1;
                    $.each(result, function (i, v) {
                        if (v.wt_PID != 0) {
                            sxnu.subNumList.push(v); // 记录子级试题编号
                        } else {
                            var temp = new sxnu.ST_Model(v.wt_ID, par_num, v.wt_Type);
                            sxnu.ST_NumList.push(temp);
                            par_num++;
                            if (sxnu.ParentSJ_ID() == v.wt_ID) {  // 记录父子关系试题索引
                                sxnu.IndexNum(par_num);
                                sxnu.Parent_OrderNum(v.wt_OrderNum);
                            }
                        }
                    });
                    // 二级编号
                    $.each(sxnu.ST_NumList(), function (i, v) {
                        if (v.type() == 4) {
                            var num = 1;
                            $.each(sxnu.subNumList(), function (i1, item) {
                                if (v.dbID() == item.wt_PID) {
                                    v.subNum.push({ dbID: item.wt_ID, type: item.wt_Type, ShowNum: v.ShowNum() + "." + num });
                                    num++
                                }
                            });
                            num = 1;
                        }
                    });

                    if (model) {
                        sxnu.ShowSTByLoccation(model);
                    }
                    $("#MaskMain").unmask();
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }
    sxnu.GenerateST_Num = function () {
        // 二级编号
        $.each(sxnu.ST_NumList(), function (i, v) {
            if (v.wt_PID == sxnu.ParentSJ_ID()) {
                maxNum++;
            }
            if (v.type() == 4) {
                var num = 1;
                $.each(sxnu.subNumList(), function (i1, item) {
                    if (v.dbID() == item.wt_PID) {
                        v.subNum.push({ dbID: item.wt_ID, type: item.wt_Type, ShowNum: v.ShowNum() + "." + num });
                        num++
                    }
                });
                num = 1;
            }
        });
    }
    //===========================================试题展示信息 以及 试题编号=== 结束=====================
    sxnu.zhST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);

        this.Title_pic_vido = ko.observableArray();
        this.Title = ko.observable();
        this.Time = ko.observable(0);
        this.st_GaiYao = ko.observable();
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

    }
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
        this.wt_LogicRelated = ko.observable();
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
        this.Clac_Len = ko.computed(function () {
            if (this.Ansure_Content().length > parseInt(this.Contentlength())) {
                var str = this.Ansure_Content().substr(0, this.Contentlength());
                this.Ansure_Content(str);
                return 0;
            } else {
                return parseInt(this.Contentlength()) - this.Ansure_Content().length;
            }
        }, this);
    }

    //sxnu.ShowSTByLoccation = function (val) {
    //    // 元素id  'StNum_'+dbID()
    //    var dbid = 0;
    //    $("#st_numLisr a").removeClass("wly_menber_hov");
    //    if ("subNum" in val) {
    //        $("#dbid_" + val.dbID()).addClass("wly_menber_hov");
    //        dbid = val.dbID();
    //    } else {
    //        $("#dbid_" + val.dbID).addClass("wly_menber_hov");
    //        dbid = val.dbID;
    //    }


    //    $.each(sxnu.Globle_STList(), function (index, val) {
    //        if (val.wt_ID == dbid) {
    //            console.log(dbid + '==========' + val.wt_ID);
    //        }
    //    });
    //}

    sxnu.Init_Vido = function () {
        if (sxnu.ShowSTInfo().length > 0) {
            $.each(sxnu.ShowSTInfo(), function (pvindex, pv) {
                $.each(pv.Title_pic_vido(), function (subindex, subpv) {
                    if (subpv.t == "v") {
                        var id = subpv.n.replace('.', '');
                        var str = "<embed src='/Content/widget/ckplayer/ckplayer.swf' quality='high' wmode='transparent' align='middle' allowscriptaccess='always' allowfullscreen='true'";
                        str += "flashvars='" + sxnu.p_Path() + subpv.n + "&p=2' type='application/x-shockwave-flash' width='300' height='200' >";
                        $("#" + id).append(str);
                    }

                });
            });
        }
    }
    sxnu.ShowSTByLoccation = function (val) {
        // 元素id  'StNum_'+dbID()
        var dbid = 0;
        var showNumber = "";
        $("#st_numLisr a").removeClass("wly_menber_hov");
        if ("subNum" in val) {
            $("#dbid_" + val.dbID()).addClass("wly_menber_hov");
            dbid = val.dbID();
            showNumber = val.ShowNum();
        } else {
            $("#dbid_" + val.dbID).addClass("wly_menber_hov");
            dbid = val.dbID;
            showNumber = val.ShowNum;
        }
        var Te_STMode;
        $.each(sxnu.Globle_STList(), function (index, item) {
            if (item.wt_ID == dbid) {
                Te_STMode = item;
                return;
            }
        });

        sxnu.ShowSTInfo.removeAll();
        switch (parseInt(Te_STMode.wt_Type)) {
            case 1:
                var dxModel = new sxnu.ddxST_Model(Te_STMode.wt_ID, showNumber, parseInt(Te_STMode.wt_Type));
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
                wtModel.inputArray = ko.observableArray();
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

        sxnu.Init_Vido();
    }

    // 试题 编号 试题展示 
    sxnu.pv_Path = ko.observable("");

    sxnu.ST_Model = function (dbID, ShowNum, type) {
        this.subNum = ko.observableArray();
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);
    }

    sxnu.ShowSTInfo = ko.observableArray();  //  展示试题信息的数组对象 
    //===========================================试题展示信息 以及 试题编号=== 结束=====================


    sxnu.p_Path = ko.observable("");
    sxnu.PageInit = function () {
        $(".type ul li").click(function () {
            if (sxnu.Title_pic_vido().length > 1 || sxnu.Item().length > 2 || sxnu.other().length > 2) {
                if (confirm("你还没有保存当前数据.确定要放弃保存吗？")) {
                    $(".type ul li").removeClass("type_hover");
                    $(this).addClass("type_hover");
                    var Index = $(this).index();
                    $(".ti").hide();
                    $(".ti:eq(" + Index + ")").show();
                    sxnu.InitUploadContron("filePicker1", "t");
                }
            }
            else {
                $(".type ul li").removeClass("type_hover");
                $(this).addClass("type_hover");
                var Index = $(this).index();
                $(".ti").hide();
                $(".ti:eq(" + Index + ")").show();
                sxnu.InitUploadContron("filePicker1", "t");
            }
        })
        sxnu.Init(1);
        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.ParentSJ_ID($("#ParentSJ_ID").val());
        sxnu.pv_Path("/WJ_Attachment/" + $("#WJ_ID").val() + "/");
        sxnu.p_Path("f=../../../WJ_Attachment/" + $("#WJ_ID").val() + "/");
        sxnu.Load_ST_List();
        sxnu.GetMaxSubList();
    }
    sxnu.PageInit();


}
var SXNU_ViewModel_Ques4 = function ($, currentDom) {


    var sxnu = currentDom || this;
    sxnu.Globle_OrderNum = ko.observable(0);
    sxnu.s4_DataArray = ko.observableArray();
    sxnu.Globle_STList = ko.observableArray();
    sxnu.Sleep_Notify = ko.observable("");
    sxnu.Sleep_Time = ko.observable(0);
    sxnu.CurrentClickGet_StMode = ko.observable();
    sxnu.Relation_NumList = ko.observableArray([]);

    sxnu.Cancel_Sleep = function (val) {
        var fromDataModel = {
            wt_ID: val.ID,
            wt_Sleep: ""
        }
        $.ajax("/Admin/Question/Set_Sleep", { async: true, cache: false, type: "GET", data: fromDataModel, dataType: "json" }).then(function (result) {
            if (result.IsSuccess) {
                sxnu.Load_ST_List();
                alert("取消休息成功！");
            } else {
                alert("取消休息失败！");
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    sxnu.submit_Sleep = function () {
        if (sxnu.Sleep_Notify().trim().length == 0 || !sxnu.IsNumber(sxnu.Sleep_Time())) {
            alert("休息信息设置有误！");
            return false;
        }
        var P_Model = { n: sxnu.Sleep_Notify().trim(), t: sxnu.Sleep_Time() };
        var fromDataModel = {
            wt_ID: sxnu.CurrentClickGet_StMode().ID,
            //wt_WJID: $("#WJ_ID").val(),
            //wt_PID: sxnu.CurrentClickGet_StMode().pID,
            wt_Sleep: JSON.stringify(P_Model)
        }
        $.ajax("/Admin/Question/Set_Sleep", { async: true, cache: false, type: "GET", data: fromDataModel, dataType: "json" }).then(function (result) {
            if (result.IsSuccess) {
                sxnu.Load_ST_List();
                alert("设置成功！");
                $("#s4_sleep").dialog('close');
                sxnu.Sleep_Notify("");
                sxnu.Sleep_Time(0);
            } else {
                alert("设置失败！");
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }

    sxnu.Set_Pageing = function (val) {
        var fromDataModel = {
            wt_ID: val.ID,
            wt_Pageing: val.pageing == 'n' ? 'y' : 'n'
        }
        $.ajax("/Admin/Question/Set_Pageing", { async: true, cache: false, type: "GET", data: fromDataModel, dataType: "json" }).then(function (result) {
            if (result.IsSuccess) {
                sxnu.Load_ST_List();
                alert(val.pageing == 'n' ? "添加分页成功！" : "取消分页成功！");

            } else {
                alert(val.pageing == 'n' ? "添加分页失败！" : "取消分页失败！");
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }

    sxnu.wj_ID = ko.observable(0);

    sxnu.Delete_SJ = function (val) {
        if (confirm("确定要删除试题吗？")) {
            $.ajax("/Admin/Question/Delete_SJ", { async: true, cache: false, type: "GET", data: { ID: val.ID }, dataType: "json" }).then(function (result) {
                if (result.IsSuccess) {
                    sxnu.Load_ST_List();
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }

    }
    sxnu.AddAndModify = function (UserModel, flg) {
        if (sxnu.UserIsExits()) { return false };
        if (sxnu.ValidateData(sxnu.userName(), sxnu.userEmail())) {
            $.ajax("/Admin/Question/AddAccount", { async: true, type: "POST", cache: false, data: UserModel, dataType: "json", }).then(function (result) {
                if (result) {
                    if (result.IsSuccess) {
                        alert(flg == "C" ? "创建成功！" : "修改成功！");
                        window.location.href = "/Admin/User/AccountManage";
                    } else {
                        alert(flg == "C" ? "创建失败！" : "修改失败！");
                    }
                }
            }).fail(function () {
                alert(flg == "C" ? "创建失败！" : "修改失败！");
            });
        }
    }

    sxnu.IsNumber = function (val) {
        var patrn = /^\+?[1-9][0-9]*$/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.ST_up = function (val) {
        if (val.index == 0) { return; }
        //$("#MaskMain").mask("正在加载.......");
        var Up_Down = {
            Pro_ID: val.ID,
            Pro_Num: sxnu.s4_DataArray()[val.index - 1].stNum,
            Pro_PID: sxnu.s4_DataArray()[val.index - 1].pID,
            Next_ID: sxnu.s4_DataArray()[val.index - 1].ID,
            Next_Num: val.stNum,
            Next_PID: val.pID
        }
        if (Up_Down.Pro_PID != Up_Down.Next_PID) { alert("子试题无法进行次操作！"); $("#MaskMain").unmask(); return false; }

        $.ajax("/Admin/Question/Set_UP_Down", { async: true, cache: false, type: "GET", data: Up_Down, dataType: "json" }).then(function (result) {
            if (result.IsSuccess) {

                var Temp = [];
                var t_m; //上一个元素
                $.each(sxnu.s4_DataArray(), function (i, item) {
                    if (i == val.index) {
                        t_m = Temp.pop();
                        //var t = t_m.stNum;
                        //t_m.stNum = item.stNum;
                        //item.stNum = t;
                        Temp.push(item);
                        Temp.push(t_m);
                    } else {
                        Temp.push(item);
                    }
                });
                sxnu.s4_DataArray(Temp);


                $("#MaskMain").unmask();
                sxnu.Load_ST_List();
            }
        }).fail(function () {
            alert("系统异常！");
        });

    }
    sxnu.ST_down = function (val) {
        if (sxnu.s4_DataArray().length == 1 || (sxnu.s4_DataArray().length - 1) == val.index) {
            return;
        }
        //$("#MaskMain").mask("正在加载.......");
        var Up_Down = {
            Pro_ID: sxnu.s4_DataArray()[val.index + 1].ID,
            Pro_Num: val.stNum,
            Pro_PID: val.pID,
            Next_ID: val.ID,
            Next_Num: sxnu.s4_DataArray()[val.index + 1].stNum,
            Next_PID: sxnu.s4_DataArray()[val.index + 1].pID
        }

        if (Up_Down.Pro_PID != Up_Down.Next_PID) { alert("子试题无法进行次操作！"); $("#MaskMain").unmask(); return false; }

        $.ajax("/Admin/Question/Set_UP_Down", { async: true, cache: false, type: "GET", data: Up_Down, dataType: "json" }).then(function (result) {
            if (result.IsSuccess) {
                var Temp = [];
                var currnt_model;
                $.each(sxnu.s4_DataArray(), function (i, item) {
                    Temp.push(item);
                });
                currnt_model = Temp[val.index];
                Temp[val.index] = Temp[val.index + 1];
                Temp[val.index + 1] = currnt_model;
                sxnu.s4_DataArray(Temp);

                $("#MaskMain").unmask();
                sxnu.Load_ST_List();
            }
        }).fail(function () {
            alert("系统异常！");
        });

    }

    sxnu.Set_Sleep = function (Row_Model) {

        $("#s4_sleep").dialog({
            resizable: false,
            height: 440,
            width: 650,
            modal: true
        });
        sxnu.CurrentClickGet_StMode(Row_Model); // 获取当前修改的试题对象
    }

    sxnu.Set_Relation = function (Row_Model) {
        //if (sxnu.ShowSTInfo().length == 0) { return false; }
        sxnu.Relation_NumList.removeAll();
        $.each(sxnu.s4_DataArray(), function (i, v) {
            if (v.index > Row_Model.index) {
                //if (parseFloat(v.showNumber) > parseFloat(Row_Model.showNumber)) {
                sxnu.Relation_NumList.push(v);
            }
        });

        $("#s4_relation").dialog({
            resizable: false,
            height: 700,
            width: 750,
            modal: true
        });
        sxnu.ShowSTByLoccation(Row_Model);
        sxnu.CurrentClickGet_StMode(Row_Model);// 获取当前修改的试题对象
        sxnu.Init_Vido();

    }

    sxnu.Init_Vido = function () {
        if (sxnu.ShowSTInfo().length > 0) {
            $.each(sxnu.ShowSTInfo(), function (pvindex, pv) {
                $.each(pv.Title_pic_vido(), function (subindex, subpv) {
                    if (subpv.t == "v") {
                        var id = subpv.n.replace('.', '');
                        var str = "<embed src='/Content/widget/ckplayer/ckplayer.swf' quality='high' wmode='transparent' align='middle' allowscriptaccess='always' allowfullscreen='true'";
                        str += "flashvars='" + sxnu.p_Path() + subpv.n + "&p=2' type='application/x-shockwave-flash' width='300' height='200' >";
                        $("#" + id).append(str);
                    }

                });
            });
        }
    }

    sxnu.Submited_Relation = function () {
        // 添加关联
        sxnu.Set_RelationToDB('y');
    }

    sxnu.Del_Relation = function (val) {
        // 删除关联
        sxnu.Set_RelationToDB("", val);
    }


    sxnu.Set_RelationToDB = function (val, rowM) {
        var fromDataModel = {
            wt_ID: val == 'y' ? sxnu.ShowSTInfo()[0].dbID() : rowM.ID,
            wt_LogicRelated: val,
            wt_Options: ""
        }
        var ItemArray = new Array();
        if (val == "y") {
            var flag = true;
            var index = sxnu.ShowSTInfo()[0].wt_Options().length + sxnu.ShowSTInfo()[0].wt_OtherItem().length;
            $.each(sxnu.ShowSTInfo()[0].wt_Options(), function (i, item) {
                var Temp = { t: item.item(), f: item.fz(), pv: [], r: item.r() };
                flag = item.r() == "" ? true : false;
                if (item.r() == "") { index-- }
                $.each(item.pv(), function (ii, item1) {
                    Temp.pv.push({ n: item1.n, t: item1.t });
                });
                ItemArray.push(Temp);
            });
            $.each(sxnu.ShowSTInfo()[0].wt_OtherItem(), function (i, item) {
                var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [], r: item.r() };
                if (item.r() == "") { index-- }
                $.each(item.pv(), function (ii, item1) {
                    Temp.pv.push({ n: item1.n, t: item1.t });
                });
                ItemArray.push(Temp);
            });
            if (index == 0) { alert("最少添加一个关联！"); return false; }

        } else {
            // 调用 页面刚加载的时候保存的所有试题对象进行 删除逻辑操作  sxnu.Globle_STList();
            $.each(sxnu.Globle_STList(), function (val, item) {
                if (item.wt_ID == fromDataModel.wt_ID) {
                    var tempA = JSON.parse(item.wt_Options);
                    $.each(tempA, function (i, v) {
                        v.r = "";
                        ItemArray.push(v);
                    })
                    return false;
                }
            });
        }

        fromDataModel.wt_Options = JSON.stringify(ItemArray);
        $.ajax("/Admin/Question/Set_Relation", { async: true, cache: false, type: "GET", data: fromDataModel, dataType: "json" }).then(function (result) {
            if (result.IsSuccess) {
                $("#s4_relation").dialog('close');
                sxnu.Load_ST_List();

            } else {
                alert("关联设置失败！");
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }



    sxnu.DataMode4 = function (title, id, pID, wj_ID, stNum, pageing, relation, sleep, IsShowRe, IsShowSl, type, showNumber) {
        this.index = 0;
        this.Title = title;
        this.ID = id;
        this.pID = pID;
        this.wj_ID = wj_ID;
        this.stNum = stNum;
        this.pageing = pageing;
        this.relation = relation;
        this.sleep = sleep;

        this.type = type;
        this.IsShowRe = IsShowRe;
        this.IsShowSl = IsShowSl;
        this.showNumber = showNumber;

    }

    //===========================================试题展示信息 以及 试题编号=== 结束=====================
    sxnu.item_model = function (item, fz, r) {
        this.hs_pv = ko.observable(false);
        this.id = ko.observable(("vp" + Math.random(1, 10000)).replace('.', ''));
        this.item = ko.observable(item);
        this.fz = ko.observable(fz);
        this.pv = ko.observableArray([]);
        this.r = ko.observable(r);
    }
    sxnu.ShowSTByLoccation = function (val) {
        // 元素id  'StNum_'+dbID()
        var dbid = val.ID;
        var showNumber = val.showNumber;
        var Te_STMode;
        $.each(sxnu.Globle_STList(), function (index, item) {
            if (item.wt_ID == dbid) {
                Te_STMode = item;
                return;
            }
        });
        sxnu.ShowSTInfo.removeAll();
        switch (parseInt(Te_STMode.wt_Type)) {
            case 1:
                var dxModel = new sxnu.ddxST_Model(Te_STMode.wt_ID, showNumber, parseInt(Te_STMode.wt_Type));
                dxModel.wt_Title(Te_STMode.wt_Title);
                dxModel.wt_LimitTime(Te_STMode.wt_LimitTime);
                var tpv = JSON.parse(Te_STMode.wt_Problem == "" ? "[]" : Te_STMode.wt_Problem);
                $.each(tpv, function (i, val) {
                    dxModel.Title_pic_vido.push({ n: val.n, t: val.t });
                });
                var item = JSON.parse(Te_STMode.wt_Options == "" ? "[]" : Te_STMode.wt_Options);
                $.each(item, function (i, val) {
                    var temp = new sxnu.item_model(val.t, val.f, val.r);
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
                    var temp = new sxnu.item_model(val.t, val.f, val.r);
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
        }
    }




    // 试题 编号 试题展示 
    sxnu.pv_Path = ko.observable("");

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
    }


    //===========================================试题展示信息 以及 试题编号=== 结束=====================



    sxnu.ST_NumList = ko.observableArray();
    sxnu.subNumList = ko.observableArray();

    sxnu.Load_ST_List = function () {
        if (sxnu.wj_ID() != 0) {
            $("#MaskMain").mask("正在加载.......");
            $.ajax("/Admin/Question/GetSTBy_WJID", { async: true, type: "GET", cache: false, data: { ID: sxnu.wj_ID() }, dataType: "json", }).then(function (result) {
                if (result) {
                    if (result.length != 0) {
                        sxnu.ST_NumList.removeAll();
                        sxnu.subNumList.removeAll();
                        sxnu.s4_DataArray.removeAll();
                        sxnu.Globle_STList.removeAll();


                        sxnu.Globle_STList(result);
                        $.each(result, function (i, v) {
                            if (v.wt_PID != 0) {
                                sxnu.subNumList.push(v); // 记录子级试题编号
                            } else {
                                sxnu.ST_NumList.push(v);
                            }
                        });

                        if (sxnu.ST_NumList()[sxnu.ST_NumList().length - 1].wt_PID != "0") {
                            sxnu.subNumList()[sxnu.subNumList().length - 1].wt_PID = "-1";
                            sxnu.subNumList()[sxnu.subNumList().length - 1].wt_Type = "0";

                        } else {
                            sxnu.ST_NumList()[sxnu.ST_NumList().length - 1].wt_PID = "-1";
                            sxnu.ST_NumList()[sxnu.ST_NumList().length - 1].wt_Type = "0";
                        }

                        var parNum = 1;
                        $.each(sxnu.ST_NumList(), function (i, v) {
                            var t = sxnu.Proc_Str(v.wt_Type, v.wt_Title);

                            sxnu.s4_DataArray.push(new sxnu.DataMode4(t, v.wt_ID, v.wt_PID, v.wt_WJID, v.wt_OrderNum, v.wt_Pageing, v.wt_LogicRelated, v.wt_Sleep, v.wt_LogicRelated.trim().length == 0, v.wt_Sleep.trim().length == 0, v.wt_Type, parNum));
                            if (v.wt_Type == 4) {
                                var subNum = 1;
                                $.each(sxnu.subNumList(), function (i1, item) {
                                    if (v.wt_ID == item.wt_PID) {
                                        var t = sxnu.Proc_Str(item.wt_Type, item.wt_Title);
                                        sxnu.s4_DataArray.push(new sxnu.DataMode4(t, item.wt_ID, item.wt_PID, item.wt_WJID, item.wt_OrderNum, item.wt_Pageing, item.wt_LogicRelated, item.wt_Sleep, item.wt_LogicRelated.trim().length == 0, item.wt_Sleep.trim().length == 0, item.wt_Type, parNum + "." + subNum));
                                        subNum++;
                                    }
                                });
                                subNum = 1;
                            }
                            parNum++;
                        });
                        $("#MaskMain").unmask();
                    } else { $("#MaskMain").unmask(); }
                } else { $("#MaskMain").unmask(); }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }
    sxnu.Proc_Str = function (type, str) {
        var t = "";
        var t1 = "";
        switch (type) {
            case "1":
                t1 = "【单选题】";
                break;
            case "2":
                t1 = "【多选题】";
                break;
            case "3":
                t1 = "【问答题】";
                break;
            case "4":
                t1 = "【组合题】";
                break;
            case "5":
                t1 = "【表格题】";
                break;
        }

        t = str.substr(0, 15);
        return t1 + t + "......";
    }
    sxnu.p_Path = ko.observable();
    sxnu.PageInit = function () {
        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.pv_Path("/WJ_Attachment/" + $("#WJ_ID").val() + "/");
        sxnu.p_Path("f=../../../WJ_Attachment/" + $("#WJ_ID").val() + "/");
        sxnu.Load_ST_List();
    }
    sxnu.PageInit();


}
// 修改试题对象
var SXNU_ViewModel_ModifyST = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.wj_ID = ko.observable(0);
    sxnu.sj_ID = ko.observable(0);
    sxnu.Globle_OrderNum = ko.observable(0);
    sxnu.g_picExt = [".jpg", ".png", ".gif"];  //(图片格式：jpg、png、gif格式，最佳尺寸130*130;
    sxnu.g_vidoExt = [".flv", ".mp4", ".avi", ".ogg"];   //视频格式：flv、mp4、avi格式，最大支持5M)
    sxnu.stType = {   //  数据库分别代表  1 2 3 4 5
        dx: "单选题",
        dux: "多选题",
        wd: "问答题",
        zh: "组合题",
        bg: "表格题"
    }
    //================== 单选题  开始==========
    sxnu.item_model = function (item, fz, r) {
        this.hs_pv = ko.observable(false);
        this.id = ko.observable(("vp" + Math.random(1, 10000)).replace('.', ''));
        this.item = ko.observable(item);
        this.fz = ko.observable(fz);
        this.pv = ko.observableArray([]);
        this.r = ko.observable(r);
    }
    sxnu.T_itmeID = ko.observable("");
    sxnu.T_otherID = ko.observable("");

    sxnu.SaveTM = ko.observable();
    sxnu.SaveTempModel = function (val) {
        sxnu.SaveTM(val);
        return true;
    }
    sxnu.ST_Type = ko.observable(1); //  数据库分别代表  1  2  3  4  5

    sxnu.Title = ko.observable("");
    sxnu.wd_Title = ko.observable("");
    sxnu.zuhe_Title = ko.observable("");
    sxnu.bg_Title = ko.observable("");
    sxnu.Title_pic_vido = ko.observableArray();
    sxnu.Time = ko.observable(0);

    sxnu.Item = ko.observableArray();
    sxnu.other = ko.observableArray();


    sxnu.IsShow_pv = function (val) {
        if (val.hs_pv()) {
            val.hs_pv(false);
        } else {
            val.hs_pv(true);
        }
    }

    sxnu.InvaildStr = function (val) {
        var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.IsNumber = function (val) {
        var patrn = /^\+?[1-9][0-9]*$/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.IsFZandTime = function (val) {
        var patrn = /^\+?[0-9]*$/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }

    sxnu.DeleteKOFile = function (val, type) {
        switch (sxnu.ST_Type()) {
            case 1:
                if (type == "t") {
                    sxnu.Title_pic_vido.remove(val);
                }
                if (type == "i") {
                    $.each(sxnu.Item(), function (i, item) {
                        $.each(sxnu.Item()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.Item()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                if (type == "o") {
                    $.each(sxnu.other(), function (i, item) {
                        $.each(sxnu.other()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.other()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                break;
            case 2:
                if (type == "t") {
                    sxnu.Title_pic_vido2.remove(val);
                }
                if (type == "i") {
                    $.each(sxnu.Item2(), function (i, item) {
                        $.each(sxnu.Item2()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.Item2()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                if (type == "o") {
                    $.each(sxnu.other2(), function (i, item) {
                        $.each(sxnu.other2()[i].pv(), function (ii, item1) {
                            if (val.n == item1.n) {
                                sxnu.other2()[i].pv.remove(val);
                                return false;
                            }
                        });
                    });
                }
                break;
            case 3:
                sxnu.Title_pic_vido3.remove(val);
                break;
            case 4:
                sxnu.Title_pic_vido4.remove(val);
                break;
            case 5:
                sxnu.Title_pic_vido5.remove(val);
                break;

        }
    }

    sxnu.DeleteFileByServer = function (val, type) {
        var filePath = sxnu.wj_ID() + "/" + val.n
        $.ajax("/Admin/Question/DeleteFile", { async: true, type: "GET", cache: false, data: { FilePath: filePath }, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                sxnu.DeleteKOFile(val, type)
            } else {
                alert("删除失败");
            }
        })
    }
    sxnu.DelTitleFile = function (val) {
        sxnu.DeleteFileByServer(val, "t");
    }
    sxnu.DelItemFile = function (val) {
        sxnu.DeleteFileByServer(val, "i");
    }
    sxnu.DelOtherFile = function (val) {
        sxnu.DeleteFileByServer(val, "o");
    }

    sxnu.Delete_Item = function (val) {
        switch (sxnu.ST_Type()) {
            case 1:
                if (sxnu.Item().length == 1) {
                    return false;
                }
                sxnu.Item.remove(val);
                break;
            case 2:
                if (sxnu.Item2().length == 1) {
                    return false;
                }
                sxnu.Item2.remove(val);
                break;
            case 3:
                break;
            case 4:
                break;
        }


    }
    sxnu.Delete_OtherItem = function (val) {
        switch (sxnu.ST_Type()) {
            case 1:
                sxnu.other.remove(val);
                break;
            case 2:
                sxnu.other2.remove(val);
                break;
            case 3:
                break;
            case 4:
                break;
        }

    }
    sxnu.Add_Item = function () {
        var tm = new sxnu.item_model("", 0);
        switch (sxnu.ST_Type()) {
            case 1:
                sxnu.Item.push(tm);
                sxnu.T_itmeID(tm.id());
                sxnu.InitUploadContron(tm.id(), "i");
                break;
            case 2:
                sxnu.Item2.push(tm);
                sxnu.T_itmeID(tm.id());
                sxnu.InitUploadContron(tm.id(), "i");
                break;
            case 3:
                break;
            case 4:
                break;
        }



    }


    sxnu.Add_Other = function () {
        var tm = new sxnu.item_model("", 0, "");
        switch (sxnu.ST_Type()) {
            case 1:
                sxnu.other.push(tm);
                sxnu.T_otherID(tm.id());
                sxnu.InitUploadContron(tm.id(), "o");
                break;
            case 2:
                sxnu.other2.push(tm);
                sxnu.T_otherID(tm.id());
                sxnu.InitUploadContron(tm.id(), "o");
                break;
            case 3:
                break;
            case 4:
                break;
        }

    }
    //type  =   title   item   other
    sxnu.InitUploadContron = function (element_id, type) {
        var $ = jQuery,
        $list = $('#fileList'),
        ratio = window.devicePixelRatio || 1,
        uploader;
        uploader = WebUploader.create({
            auto: true,
            duplicate: true,
            prepareNextFile: true,
            fileSingleSizeLimit: 6 * 1024 * 1024,   // 6 M
            disableGlobalDnd: true,
            formData: {
                wjID: $("#WJ_ID").val(),
            },
            swf: '../../Scripts/uploader.swf',
            server: '/Admin/Question/SubmitedStep3',
            pick: '#' + element_id + '',
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,png,flv,mp4,avi,doc,docx,xlsx,xls,ogg,3gp'
            }
        });
        uploader.on('uploadSuccess', function (file, response) {
            fileExt = file.name.substr(file.name.lastIndexOf(".")).toLowerCase();
            switch (sxnu.ST_Type()) {
                case 1:
                    if (type == "t") {
                        if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                            sxnu.Title_pic_vido.push({ n: response.fileName, t: "p" });
                        }
                        if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                            sxnu.Title_pic_vido.push({ n: response.fileName, t: "v" });
                        }
                    }
                    if (type == "i") {
                        $.each(sxnu.Item(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.Item()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.Item()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    if (type == "o") {
                        $.each(sxnu.other(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.other()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.other()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    break;
                case 2:
                    if (type == "t") {
                        if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                            sxnu.Title_pic_vido2.push({ n: response.fileName, t: "p" });
                        }
                        if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                            sxnu.Title_pic_vido2.push({ n: response.fileName, t: "v" });
                        }
                    }
                    if (type == "i") {
                        $.each(sxnu.Item2(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.Item2()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.Item2()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    if (type == "o") {
                        $.each(sxnu.other2(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.other2()[i].pv.push({ n: response.fileName, t: "p" });
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.other2()[i].pv.push({ n: response.fileName, t: "v" });
                                }
                                return false;
                            }
                        });
                    }
                    break;
                case 3:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido3.push({ n: response.fileName, t: "p" });
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido3.push({ n: response.fileName, t: "v" });
                    }
                    break;
                case 4:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido4.push({ n: response.fileName, t: "p" });
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido4.push({ n: response.fileName, t: "v" });
                    }
                    break;
                case 5:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido5.push({ n: response.fileName, t: "p" });
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido5.push({ n: response.fileName, t: "v" });
                    }
                    break;
            }
        });
        uploader.on('fileQueued', function (file) {

        });
        uploader.on('uploadProgress', function (file, percentage) {

        });
        uploader.on('uploadError', function (file) {

        });
        uploader.on('uploadComplete', function (file) {

        });
        uploader.on("uploadFinished", function () {

        });
    }


    sxnu.LoadWJ = function () {
        if (sxnu.wj_ID() != 0) {
            $.ajax("/Admin/Question/GetWJByID", { async: true, type: "GET", cache: true, data: { ID: sxnu.wj_ID() }, dataType: "json", }).then(function (result) {
                if (result) {

                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.Save_dx = function () {
        var flag = true;
        sxnu.ST_Type(1);
        var fromDataModel = {
            wt_ID: sxnu.sj_ID(),
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title(),
            wt_LimitTime: sxnu.Time(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: ""

        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var ItemArray = new Array();
        var strArray = [];
        $.each(sxnu.Item(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [], r: item.r() };
            if (!$.trim(item.item()) || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });
        $.each(sxnu.other(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [], r: item.r() };
            if (!$.trim(item.item()) || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });

        if (!flag) {
            alert("输入信息有误！");
            return false;
        }
        if (!sxnu.Title().trim() || sxnu.Item().length < 1 || !sxnu.IsFZandTime(sxnu.Time())) {
            alert("输入信息有误！");
            return false;
        }
        if (IsRepeat(strArray)) {
            alert("不能添加重复项！");
            return false;
        }
        fromDataModel.wt_Options = JSON.stringify(ItemArray);
        sxnu.Save_Ajax(fromDataModel);

    }
    sxnu.Save_Ajax = function (DataModel) {
        $.ajax("/Admin/Question/Modeify_ST", { async: true, type: "POST", cache: false, data: DataModel, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                alert("修改成功！");
                window.location.href = "/Admin/Question/Step4?ID=" + DataModel.wt_WJID;
            } else {
                alert("修改失败！");
            }
        }).fail(function () {
            alert("请求失败！");
        });
    }
    //==================单选题   结束===========




    //==================多选题   开始===========

    sxnu.Title2 = ko.observable("");
    sxnu.Time2 = ko.observable(0);
    sxnu.Title_pic_vido2 = ko.observableArray();
    sxnu.Item2 = ko.observableArray();
    sxnu.other2 = ko.observableArray();

    sxnu.Save_duox = function () {
        sxnu.ST_Type(2);
        var flag = true;
        var fromDataModel = {
            wt_ID: sxnu.sj_ID(),
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title2(),
            //wt_PID: 0,
            wt_LimitTime: sxnu.Time2(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: ""
            //wt_IsAnswer: "y",
            //wt_LogicRelated: ""
        }

        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido2(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var ItemArray = new Array();
        var strArray = [];
        $.each(sxnu.Item2(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [], r: item.r() };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });
        $.each(sxnu.other2(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [], r: item.r() };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
            strArray.push(Temp.t);
        });
        fromDataModel.wt_Options = JSON.stringify(ItemArray);
        if (!flag) {
            alert("输入信息有误！");
            return false;
        }
        if (!sxnu.Title2().trim() || sxnu.Item2().length < 1 || !sxnu.IsFZandTime(sxnu.Time2())) {
            alert("输入信息有误！");
            return false;
        }
        if (IsRepeat(strArray)) {
            alert("不能添加重复项！");
            return false;
        }
        sxnu.Save_Ajax(fromDataModel);
    }
    //==================多选题   结束===========




    //==================问答题  开始===========


    sxnu.Title3 = ko.observable("");
    sxnu.Time3 = ko.observable(0);
    sxnu.Title_pic_vido3 = ko.observableArray();

    sxnu.Contentlength = ko.observable(0);
    sxnu.IsOnline = ko.observable(0);
    sxnu.Customize = ko.observable(0);
    sxnu.IsUpload = ko.observable(0);

    // 保存问答题
    sxnu.Save_wd = function () {
        sxnu.ST_Type(3);
        var fromDataModel = {
            wt_ID: sxnu.sj_ID(),
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title3(),
            //wt_PID: 0,
            wt_LimitTime: sxnu.Time3(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: ""
            //wt_IsAnswer: "y",
            //wt_LogicRelated: ""
        }

        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido3(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        var temp = { cl: sxnu.Contentlength(), o: sxnu.IsOnline(), c: sxnu.Customize(), u: sxnu.IsUpload() };  // 问答题辅助信息添加
        fromDataModel.wt_Options = JSON.stringify(temp);
        if (!sxnu.Title3().trim() || !sxnu.IsFZandTime(sxnu.Time3())) {
            alert("输入信息有误！");
            return false;
        }
        sxnu.Save_Ajax(fromDataModel);
    }
    //==================问答题   结束===========

    //==================组合题   开始=========== 

    sxnu.Title4 = ko.observable("");
    sxnu.Time4 = ko.observable(0);
    sxnu.Title_pic_vido4 = ko.observableArray();
    sxnu.st_GaiYao = ko.observable("");
    sxnu.Save_zh = function () {
        sxnu.ST_Type(4);
        var fromDataModel = {
            wt_ID: sxnu.sj_ID(),
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title4(),
            //wt_PID: 0,
            wt_LimitTime: sxnu.Time4(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: sxnu.st_GaiYao()
            //wt_IsAnswer: "y",
            //wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido4(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);
        if (!sxnu.Title4().trim() || !sxnu.IsFZandTime(sxnu.Time4())) {
            alert("输入信息有误！");
            return false;
        }
        sxnu.Save_Ajax(fromDataModel);
        //$.ajax("/Admin/Question/Save_ZHST", { async: true, type: "POST", cache: false, data: fromDataModel, dataType: "json", }).then(function (result) {
        //    if (result.IsSuccess) {
        //        alert("保存成功！");
        //        //sxnu.Init(DataModel.wt_Type);
        //        window.location.href = "/Admin/Question/Subsj?ID=" + result.ReturnADD_ID + "&wjID=" + fromDataModel.wt_WJID;
        //    } else {
        //        alert("保存失败！");
        //    }
        //}).fail(function () {
        //    alert("保存失败！");
        //});
    }


    //==================组合题   结束=========== 




    //==================表格题   开始=========== 

    sxnu.m_t_5 = function (t) {
        this.t = ko.observable(t);
    }
    sxnu.m_a_5 = function (a, f) {
        this.a = ko.observable(a);
        this.f = ko.observable(f);
    }
    sxnu.Title5 = ko.observable("");
    sxnu.Time5 = ko.observable(0);
    sxnu.Title_pic_vido5 = ko.observableArray();
    sxnu.TitleLsit = ko.observableArray();
    sxnu.AnswerList = ko.observableArray();

    sxnu.add_Title5 = function () {
        sxnu.TitleLsit.push(new sxnu.m_t_5(""));
    }
    sxnu.del_Title5 = function (val) {
        sxnu.TitleLsit.remove(val);
    }

    sxnu.add_Answer5 = function () {
        sxnu.AnswerList.push(new sxnu.m_a_5("", 0));
    }
    sxnu.del_Answer5 = function (val) {
        sxnu.AnswerList.remove(val);
    }
    sxnu.Save_bg = function () {
        sxnu.ST_Type(5);
        var fromDataModel = {
            wt_ID: sxnu.sj_ID(),
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title5(),
            //wt_PID: 0,
            wt_LimitTime: sxnu.Time5(),
            wt_Type: sxnu.ST_Type(),
            wt_Problem: "",
            wt_Options: ""
            //wt_IsAnswer: "y",
            //wt_LogicRelated: ""
        }
        var baseInfo = new Array();
        baseInfo.length = 0;
        $.each(sxnu.Title_pic_vido5(), function (index, item) {
            baseInfo.push({ n: item.n, t: item.t });
        });
        fromDataModel.wt_Problem = baseInfo.length == 0 ? "" : JSON.stringify(baseInfo);

        var bg = {
            t: [],
            a: []
        };
        var flag = true;
        var strArray = [];
        $.each(sxnu.TitleLsit(), function (i, item) {
            //var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!$.trim(item.t())) {
                flag = false;
            }
            bg.t.push(item.t().trim());
        });
        $.each(sxnu.AnswerList(), function (i, item) {
            //var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!$.trim(item.a()) || !sxnu.IsFZandTime(item.f())) {
                flag = false;
            }
            bg.a.push({ t: $.trim(item.a()), f: $.trim(item.f()) });
            strArray.push($.trim(item.a()));
        });

        if (!flag) {
            alert("输入信息有误！");
            return false;
        }
        if (!sxnu.Title5().trim() || !sxnu.IsFZandTime(sxnu.Time5())) {
            alert("输入信息有误！");
            return false;
        }
        if (IsRepeat(strArray) || IsRepeat(bg.t)) {
            alert("答案 或 内容项存在重复！");
            return false;
        }
        fromDataModel.wt_Options = JSON.stringify(bg);
        sxnu.Save_Ajax(fromDataModel);
    }

    //==================表格题   结束=========== 


    sxnu.Init_Vido = function () {
        if (sxnu.ShowSTInfo().length > 0) {
            $.each(sxnu.ShowSTInfo(), function (pvindex, pv) {
                $.each(pv.Title_pic_vido(), function (subindex, subpv) {
                    if (subpv.t == "v") {
                        var id = subpv.n.replace('.', '');
                        var str = "<embed src='/Content/widget/ckplayer/ckplayer.swf' quality='high' wmode='transparent' align='middle' allowscriptaccess='always' allowfullscreen='true'";
                        str += "flashvars='" + sxnu.p_Path() + subpv.n + "&p=2' type='application/x-shockwave-flash' width='300' height='200' >";
                        $("#" + id).append(str);
                    }

                });
            });
        }
    }
    //===========================================试题展示信息 以及 试题编号=== 结束=====================
    sxnu.zhST_Model = function (dbID, ShowNum, type) {
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);

        this.Title_pic_vido = ko.observableArray();
        this.Title = ko.observable();
        this.Time = ko.observable(0);
        this.st_GaiYao = ko.observable();
    }
    sxnu.ShowSTByLoccation = function (val) {
        // 元素id  'StNum_'+dbID()
        var dbid = 0;
        var showNumber = "";
        $("#st_numLisr a").removeClass("wly_menber_hov");
        if ("subNum" in val) {
            $("#dbid_" + val.dbID()).addClass("wly_menber_hov");
            dbid = val.dbID();
            showNumber = val.ShowNum();
        } else {
            $("#dbid_" + val.dbID).addClass("wly_menber_hov");
            dbid = val.dbID;
            showNumber = val.ShowNum;
        }
        var Te_STMode;
        $.each(sxnu.Globle_STList(), function (index, val) {
            if (val.wt_ID == dbid) {
                Te_STMode = val;
                return;
            }
        });

        sxnu.ShowSTInfo.removeAll();
        switch (parseInt(Te_STMode.wt_Type)) {
            case 1:
                var dxModel = new sxnu.ddxST_Model(Te_STMode.wt_ID, showNumber, parseInt(Te_STMode.wt_Type));
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
                wtModel.inputArray = ko.observableArray();
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
        sxnu.Init_Vido();
    }
    sxnu.Init_Vido = function () {
        if (sxnu.ShowSTInfo().length > 0) {
            $.each(sxnu.ShowSTInfo(), function (pvindex, pv) {
                $.each(pv.Title_pic_vido(), function (subindex, subpv) {
                    if (subpv.t == "v") {
                        var id = subpv.n.replace('.', '');
                        var str = "<embed src='/Content/widget/ckplayer/ckplayer.swf' quality='high' wmode='transparent' align='middle' allowscriptaccess='always' allowfullscreen='true'";
                        str += "flashvars='" + sxnu.p_Path() + subpv.n + "&p=2' type='application/x-shockwave-flash' width='300' height='200' >";
                        $("#" + id).append(str);
                    }

                });
            });
        }
    }
    // 试题 编号 试题展示 
    sxnu.pv_Path = ko.observable("");

    sxnu.ST_Model = function (dbID, ShowNum, type) {
        this.subNum = ko.observableArray();
        this.dbID = ko.observable(dbID);
        this.ShowNum = ko.observable(ShowNum);
        this.type = ko.observable(type);
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
        this.wt_LogicRelated = ko.observable();
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
        this.Clac_Len = ko.computed(function () {
            if (this.Ansure_Content().length > parseInt(this.Contentlength())) {
                var str = this.Ansure_Content().substr(0, this.Contentlength());
                this.Ansure_Content(str);
                return 0;
            } else {
                return parseInt(this.Contentlength()) - this.Ansure_Content().length;
            }
        }, this);
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

    }
    //===========================================试题展示信息 以及 试题编号=== 结束=====================

    sxnu.ST_NumList = ko.observableArray();
    sxnu.subNumList = ko.observableArray();
    sxnu.Globle_STList = ko.observableArray();
    sxnu.Load_ST_List = function () {
        if (sxnu.wj_ID() != 0) {
            $.ajax("/Admin/Question/GetSTBy_WJID", { async: true, type: "GET", cache: true, data: { ID: sxnu.wj_ID() }, dataType: "json", }).then(function (result) {
                if (result) {
                    var par_num = 1;
                    sxnu.Globle_STList(result);
                    $.each(result, function (i, v) {
                        if (v.wt_PID != 0) {
                            sxnu.subNumList.push(v); // 记录子级试题编号
                        } else {
                            var temp = new sxnu.ST_Model(v.wt_ID, par_num, v.wt_Type);
                            sxnu.ST_NumList.push(temp);
                            par_num++;
                        }
                    });
                    sxnu.Globle_OrderNum(sxnu.ST_NumList().length + 1);  // 记录最大一级试题编号 按顺序编号
                    $.each(sxnu.ST_NumList(), function (i, v) {
                        if (v.type() == 4) {
                            var num = 1;
                            $.each(sxnu.subNumList(), function (i1, item) {
                                if (v.dbID() == item.wt_PID) {
                                    v.subNum.push({ dbID: item.wt_ID, type: item.wt_Type, ShowNum: v.ShowNum() + "." + num });
                                    num++
                                }
                            });
                            num = 1;
                        }
                    });

                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    // commmon  ======
    sxnu.ViewImg = function (val) {
        var imgpath = "/WJ_Attachment/" + sxnu.wj_ID() + "/" + val.n;
        window.open(imgpath);
    }

    sxnu.Init = function (STM) {
        sxnu.ST_Type(parseInt(STM.wt_Type));
        var t = parseInt(STM.wt_Type);
        STM.wt_Problem = STM.wt_Problem == "" ? "[]" : STM.wt_Problem;
        switch (t) {
            case 1:
                sxnu.Title(STM.wt_Title);
                sxnu.Time(STM.wt_LimitTime);
                var tpv = JSON.parse(STM.wt_Problem);
                $.each(tpv, function (i, val) {
                    sxnu.Title_pic_vido.push({ n: val.n, t: val.t });
                });
                var item = JSON.parse(STM.wt_Options);
                $.each(item, function (i, val) {
                    var temp = new sxnu.item_model(val.t, val.f, val.r);
                    $.each(val.pv, function (i1, val1) {
                        temp.pv.push(val1);
                    });
                    sxnu.T_itmeID(temp.id());
                    if ('o' in val) {
                        sxnu.other.push(temp);
                        sxnu.InitUploadContron(temp.id(), "o");
                    } else {
                        sxnu.Item.push(temp);
                        sxnu.InitUploadContron(temp.id(), "i");
                    }
                });
                sxnu.InitUploadContron("filePicker1", "t");
                break;
            case 2:
                sxnu.Title2(STM.wt_Title);
                sxnu.Time2(STM.wt_LimitTime);
                var tpv = JSON.parse(STM.wt_Problem);
                $.each(tpv, function (i, val) {
                    sxnu.Title_pic_vido2.push({ n: val.n, t: val.t });
                });
                var item = JSON.parse(STM.wt_Options);
                $.each(item, function (i, val) {
                    var temp = new sxnu.item_model(val.t, val.f, val.r);
                    $.each(val.pv, function (i1, val1) {
                        temp.pv.push(val1);
                    });
                    sxnu.T_itmeID(temp.id());
                    if ('o' in val) {
                        sxnu.other2.push(temp);
                        sxnu.InitUploadContron(temp.id(), "o");
                    } else {
                        sxnu.Item2.push(temp);
                        sxnu.InitUploadContron(temp.id(), "i");
                    }
                });
                sxnu.InitUploadContron("filePicker2", "t");
                break;
            case 3:
                sxnu.Title3(STM.wt_Title);
                sxnu.Time3(STM.wt_LimitTime);
                var item3 = JSON.parse(STM.wt_Options);  // cl 内容长度   o 是否在线   c 是否自定义答案条数   u 是否可以上传附件 
                sxnu.Contentlength(item3.cl);
                sxnu.IsOnline(item3.o);
                sxnu.Customize(item3.c);
                sxnu.IsUpload(item3.u);
                var tpv = JSON.parse(STM.wt_Problem);
                $.each(tpv, function (i, val) {
                    sxnu.Title_pic_vido2.push({ n: val.n, t: val.t });
                });
                sxnu.InitUploadContron("filePicker3", "t");
                break;
            case 4:
                sxnu.Title4(STM.wt_Title);
                sxnu.Time4(STM.wt_LimitTime);
                sxnu.st_GaiYao(STM.wt_Options);
                var tpv = JSON.parse(STM.wt_Problem);
                $.each(tpv, function (i, val) {
                    sxnu.Title_pic_vido4.push({ n: val.n, t: val.t });
                });
                sxnu.InitUploadContron("filePicker4", "t");
                break;
            case 5:
                sxnu.Title5(STM.wt_Title);
                sxnu.Time5(STM.wt_LimitTime);
                var tpv = JSON.parse(STM.wt_Problem);
                $.each(tpv, function (i, val) {
                    sxnu.Title_pic_vido5.push({ n: val.n, t: val.t });
                });

                var item_at = JSON.parse(STM.wt_Options);    // 选项和答案的对象内部存储为俩个数组属性
                $.each(item_at.t, function (i, val) {
                    sxnu.TitleLsit.push(new sxnu.m_t_5(val));
                });
                $.each(item_at.a, function (i, val) {
                    sxnu.AnswerList.push(new sxnu.m_a_5(val.t, val.f));
                });
                sxnu.InitUploadContron("filePicker5", "t");
                break;
        }

    }

    sxnu.LoadST_Model = function () {
        if (sxnu.sj_ID() != 0) {
            $.ajax("/Admin/Question/GetSTBy_STID", { async: true, type: "GET", cache: true, data: { ID: sxnu.sj_ID() }, dataType: "json", }).then(function (result) {
                if (result.length == 1) {
                    sxnu.Init(result[0]);
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }
    sxnu.p_Path = ko.observable("");
    sxnu.PageInit = function () {
        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.sj_ID($("#sj_ID").val());
        sxnu.pv_Path("/WJ_Attachment/" + $("#WJ_ID").val() + "/");
        $(".type ul li").addClass("type_hover");
        sxnu.p_Path("f=../../../WJ_Attachment/" + $("#WJ_ID").val() + "/");
        sxnu.LoadST_Model();
        sxnu.Load_ST_List();
    }
    sxnu.PageInit();


}
var SXNU_ViewModel_AnswerDeail = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.wj_ID = ko.observable(0);
    sxnu.SearchValue = ko.observable("");


    //==============分页 开始==============
    sxnu.AnswerPerson_List = ko.observableArray();

    sxnu.am_CurrenPageIndex = ko.observable(0);//当前第几页
    sxnu.am_PageSize = ko.observable(20); //一页显示多少条数据
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
            StrWhere: sxnu.wj_ID(),
            CurrenPageIndex: sxnu.am_CurrenPageIndex(),
            PageSize: sxnu.am_PageSize()
        }
        sxnu.AnswerPerson_List.removeAll();
        $.ajax("/Admin/Question/GetAnswerByWjid", { async: true, cache: false, type: "GET", data: parmentMode, dataType: "json" }).then(function (result) {
            if (result) {
                sxnu.AnswerPerson_List(result.Data);
                sxnu.am_TotalPage(result.TotalPages);
                sxnu.am_TotalRecord(result.TotalRecords);
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    //==============分页 结束===============

    sxnu.ViewAnswer = function (val) {
        window.open("/Ques/ViewAnswer?wjid=" + val.au_wjID + "&auid=" + val.au_ID);
    }
    sxnu.Export_WJ = function (val) {
        window.location.href = "/Admin/Question/Export_WJ?wjid=" + sxnu.wj_ID();
    }

    sxnu.Export_AnswerList = function (val) {
        window.location.href = "/Admin/Question/Export_AnswerList?wjid=" + sxnu.wj_ID();
    }

    sxnu.PageInit = function () {
        sxnu.wj_ID($("#wjid").val());
        sxnu.GetByPageingData();
    }
    sxnu.PageInit();


} 


function IsRepeat(arr) {
    //var arrStr = JSON.stringify(arr), str;
    //for (var i = 0; i < arr.length; i++) {
    //    if (arrStr.indexOf(arr[i]) != arrStr.lastIndexOf(arr[i])) {
    //        return true;
    //    }
    //};
    //return false;
    var nary = arr.sort();
    for (var i = 0; i < nary.length; i++) {
        if (nary[i] == nary[i + 1]) {
            return true;
        }
    }
    return false;
}
