 
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

    sxnu.ValidStart.subscribe(function (val) {
        $("#ValidEnd").datepicker("option", "minDate", val);

    });
    sxnu.ValidEnd.subscribe(function (val) {
        $("#ValidStart").datepicker("option", "maxDate", val);
    });


    sxnu.Submited_Step1 = function () {
        //window.location.href = "/Admin/Question/Step2";
        return true;
    }

    sxnu.ViewImg = function () {
        $("input[name='front_cover']").on("change", function () {
            var file = this.files[0];
            if (this.files && file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("#front_cover_view").attr("src", e.target.result);
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
                    $("#front_cover_view").attr('src', ("/WJ_Attachment/" + sxnu.wj_ID() + "/" + result[0].wj_BeginPic));
                    $("#WJ_fm").val(result[0].wj_BeginPic);
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
            if (item.b2() == sxnu.EnumControlsType.wbk) {
                if (!sxnu.IsNumber(item.b3())) {
                    result = false;
                    return false;
                }
            }
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

    //sxnu.s2_DataArray.push(new sxnu.bim("字段字段", "单选按钮", "xxx字段xxx", "0"));
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
        var patrn = /^\+?[1-9][0-9]*$/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
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
        $.ajax("/Admin/Question/SubmitedStep2", { async: true, type: "POST", cache: false, data: { wj_ID: sxnu.wj_ID(), wj_BaseInfo: JSON.stringify(baseInfo) }, dataType: "json", }).then(function (result) {
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
                    } else {
                        sxnu.s2_DataArray.push(new sxnu.bim("字段", "文本框", "11", "0"));
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
    sxnu.g_picExt = [".jpg", ".png", ".gif"];  //(图片格式：jpg、png、gif格式，最佳尺寸130*130;
    sxnu.g_vidoExt = [".flv", ".mp4", ".avi"];   //视频格式：flv、mp4、avi格式，最大支持5M)
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
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
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
        $.each(sxnu.Item(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
        });
        $.each(sxnu.other(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
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
        sxnu.Save_Ajax(fromDataModel);

    }
    sxnu.Save_Ajax = function (DataModel) {
        $.ajax("/Admin/Question/Save_ST", { async: true, type: "POST", cache: false, data: DataModel, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                alert("保存成功！");
                sxnu.Init(DataModel.wt_Type);
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
            formData: {
                wjID: $("#WJ_ID").val(),
            },
            server: '/Admin/Question/SubmitedStep3',
            pick: '#' + element_id + '',
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,png,flv,mp4,avi,doc,docx,xlsx,xls'
            }
        });
        uploader.on('uploadSuccess', function (file, response) {
            fileExt = file.name.substr(file.name.lastIndexOf(".")).toLowerCase();
            switch (sxnu.ST_Type()) {
                case 1:
                    if (type == "t") {
                        if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                            sxnu.Title_pic_vido.push({ n: response.fileName, t: "p"});
                        }
                        if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                            sxnu.Title_pic_vido.push({ n: response.fileName, t: "v"});
                        }
                    }
                    if (type == "i") {
                        $.each(sxnu.Item(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.Item()[i].pv.push({ n: response.fileName, t: "p"});
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.Item()[i].pv.push({ n: response.fileName, t: "v"});
                                }
                                return false;
                            }
                        });
                    }
                    if (type == "o") {
                        $.each(sxnu.other(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.other()[i].pv.push({ n: response.fileName, t: "p"});
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.other()[i].pv.push({ n: response.fileName, t: "v"});
                                }
                                return false;
                            }
                        });
                    }
                    break;
                case 2:
                    if (type == "t") {
                        if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                            sxnu.Title_pic_vido2.push({ n: response.fileName, t: "p"});
                        }
                        if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                            sxnu.Title_pic_vido2.push({ n: response.fileName, t: "v"});
                        }
                    }
                    if (type == "i") {
                        $.each(sxnu.Item2(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.Item2()[i].pv.push({ n: response.fileName, t: "p"});
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.Item2()[i].pv.push({ n: response.fileName, t: "v"});
                                }
                                return false;
                            }
                        });
                    }
                    if (type == "o") {
                        $.each(sxnu.other2(), function (i, item) {
                            if (item.id() == sxnu.SaveTM().id()) {
                                if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                                    sxnu.other2()[i].pv.push({ n: response.fileName, t: "p"});
                                }
                                if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                                    sxnu.other2()[i].pv.push({ n: response.fileName, t: "v"});
                                }
                                return false;
                            }
                        });
                    }
                    break;
                case 3:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido3.push({ n: response.fileName, t: "p"});
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido3.push({ n: response.fileName, t: "v"});
                    }
                    break;
                case 4:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido4.push({ n: response.fileName, t: "p"});
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido4.push({ n: response.fileName, t: "v"});
                    }
                    break;
                case 5:
                    if ($.inArray(fileExt, sxnu.g_picExt) != -1) {
                        sxnu.Title_pic_vido5.push({ n: response.fileName, t: "p"});
                    }
                    if ($.inArray(fileExt, sxnu.g_vidoExt) != -1) {
                        sxnu.Title_pic_vido5.push({ n: response.fileName, t: "v"});
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
        $.each(sxnu.Item2(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
        });
        $.each(sxnu.other2(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
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
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title3(),
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
    sxnu.Time4 = ko.observable(0);
    sxnu.Title_pic_vido4 = ko.observableArray();

    sxnu.Save_zh = function () {
        sxnu.ST_Type(4);
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title4(),
            wt_PID: 0,
            wt_LimitTime: sxnu.Time4(),
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

    sxnu.m_t_5 = function () {
        this.t = ko.observable("");
    }
    sxnu.m_a_5 = function () {
        this.a = ko.observable("");
        this.f = ko.observable(0);
    }

    sxnu.Title5 = ko.observable("");
    sxnu.Time5 = ko.observable(0);
    sxnu.Title_pic_vido5 = ko.observableArray();
    sxnu.TitleLsit = ko.observableArray();
    sxnu.AnswerList = ko.observableArray();

    sxnu.add_Title5 = function () {
        sxnu.TitleLsit.push(new sxnu.m_t_5());
    }
    sxnu.del_Title5 = function (val) {
        sxnu.TitleLsit.remove(val);
    }

    sxnu.add_Answer5 = function () {
        sxnu.AnswerList.push(new sxnu.m_a_5());
    }
    sxnu.del_Answer5 = function (val) {
        sxnu.AnswerList.remove(val);
    }
    sxnu.Save_bg = function () {
        sxnu.ST_Type(5);
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title5(),
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
        var flag = true;
        $.each(sxnu.TitleLsit(), function (i, item) {
            //var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.t().trim()) {
                flag = false;
            }
            bg.t.push(item.t().trim());
        });
        $.each(sxnu.AnswerList(), function (i, item) {
            //var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!item.a().trim() || !sxnu.IsFZandTime(item.f())) {
                flag = false;
            }
            bg.a.push({ t: item.a().trim(), f: item.f() });
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

    sxnu.PageInit = function () {

        sxnu.wj_ID($("#WJ_ID").val());
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


    }
    sxnu.PageInit();


}
var SXNU_ViewModel_sjSub = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.wj_ID = ko.observable(0);
    sxnu.g_picExt = [".jpg", ".png", ".gif"];  //(图片格式：jpg、png、gif格式，最佳尺寸130*130;
    sxnu.g_vidoExt = [".flv", ".mp4", ".avi"];   //视频格式：flv、mp4、avi格式，最大支持5M)
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
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title(),
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
        $.each(sxnu.Item(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
        });
        $.each(sxnu.other(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
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
        sxnu.Save_Ajax(fromDataModel);

    }
    sxnu.Save_Ajax = function (DataModel) {
        $.ajax("/Admin/Question/Save_ST", { async: true, type: "POST", cache: false, data: DataModel, dataType: "json", }).then(function (result) {
            if (result.IsSuccess) {
                alert("保存成功！");
                sxnu.Init(DataModel.wt_Type);
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
            formData: {
                wjID: $("#WJ_ID").val(),
            },
            server: '/Admin/Question/SubmitedStep3',
            pick: '#' + element_id + '',
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,png,flv,mp4,avi,doc,docx,xlsx,xls'
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
        $.each(sxnu.Item2(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
        });
        $.each(sxnu.other2(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
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
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title3(),
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

    sxnu.m_t_5 = function () {
        this.t = ko.observable("");
    }
    sxnu.m_a_5 = function () {
        this.a = ko.observable("");
        this.f = ko.observable(0);
    }

    sxnu.Title5 = ko.observable("");
    sxnu.Time5 = ko.observable(0);
    sxnu.Title_pic_vido5 = ko.observableArray();
    sxnu.TitleLsit = ko.observableArray();
    sxnu.AnswerList = ko.observableArray();

    sxnu.add_Title5 = function () {
        sxnu.TitleLsit.push(new sxnu.m_t_5());
    }
    sxnu.del_Title5 = function (val) {
        sxnu.TitleLsit.remove(val);
    }

    sxnu.add_Answer5 = function () {
        sxnu.AnswerList.push(new sxnu.m_a_5());
    }
    sxnu.del_Answer5 = function (val) {
        sxnu.AnswerList.remove(val);
    }
    sxnu.Save_bg = function () {
        sxnu.ST_Type(5);
        var fromDataModel = {
            wt_WJID: $("#WJ_ID").val(),
            wt_Title: sxnu.Title5(),
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
        $.each(sxnu.TitleLsit(), function (i, item) {
            //var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.t().trim()) {
                flag = false;
            }
            bg.t.push(item.t().trim());
        });
        $.each(sxnu.AnswerList(), function (i, item) {
            //var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!item.a().trim() || !sxnu.IsFZandTime(item.f())) {
                flag = false;
            }
            bg.a.push({ t: item.a().trim(), f: item.f() });
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
        sxnu.Save_Ajax(fromDataModel);
    }

    //==================表格题   结束=========== 








    // commmon  ======
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


    }
    sxnu.PageInit();


}
var SXNU_ViewModel_Ques4 = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.isProject_QA = ko.observable(false);


    sxnu.userName = ko.observable();
    sxnu.userEmail = ko.observable();
    sxnu.userName_error_des = ko.observable();
    sxnu.userEmail_error_des = ko.observable();
    sxnu.userName_vis = ko.observable(false);
    sxnu.userEmail_vis = ko.observable(false);

    //====== 开始step2=======================
    sxnu.ControlsType = ko.observableArray(["文本框", "单选按钮", "下拉菜单"]);
    sxnu.s4_DataArray = ko.observableArray();
     
    // ======结束step2========================

    sxnu.wj_ID = ko.observable(0);
    sxnu.Temp_User = ko.observable();
    sxnu.SearchValue = ko.observable("");
    sxnu.ValidStart = ko.observable();
    sxnu.ValidEnd = ko.observable();
    sxnu.Submited_Step3 = function () {
        window.location.href = "/Admin/Question/Step4";
    }
    //==============分页 开始==============
    sxnu.accountList = ko.observableArray();

    sxnu.am_CurrenPageIndex = ko.observable(0);//当前第几页
    sxnu.am_PageSize = ko.observable(8); //一页显示多少条数据
    sxnu.am_TotalPage = ko.observable(1); // 页总数
    sxnu.am_TotalRecord = ko.observable();//总记录数
    sxnu.UserIsExits = ko.observable(false);


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
        sxnu.accountList.removeAll();
        $.ajax("/Admin/Question/ShowAccountListByPage", { async: true, cache: false, type: "GET", data: parmentMode, dataType: "json" }).then(function (result) {
            if (result) {
                sxnu.accountList(result.Data);
                sxnu.am_TotalPage(result.TotalPages);
                sxnu.am_TotalRecord(result.TotalRecords);
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    //==============分页 结束===============

    sxnu.Delete_SJ = function (val) {

        $.ajax("/Admin/Question/Delete_SJ", { async: true, cache: false, type: "GET", data: { ID: val.ID }, dataType: "json" }).then(function (result) {
            if (result.IsSuccess) {
                sxnu.s4_DataArray.remove(val);
            }
        }).fail(function () {
            alert("系统异常！");
        });
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
    sxnu.DataMode4 = function (title, id, pID, wj_ID) {
        this.Title = title;
        this.ID = id;
        this.pID = pID;
        this.wj_ID = wj_ID;
    }
    sxnu.Load_ST_List = function () {
        if (sxnu.wj_ID() != 0) {
            $.ajax("/Admin/Question/GetSTBy_WJID", { async: true, type: "GET", cache: true, data: { ID: sxnu.wj_ID() }, dataType: "json", }).then(function (result) {
                if (result) {
                    $.each(result, function (i, v) {
                        var t = "";
                        var t1 = "";
                        if (v.wt_Type == 1) {
                            t1 = "【单选题】";
                        }
                        if (v.wt_Type == 2) {
                            t1 = "【多选题】";
                        }
                        if (v.wt_Type == 3) {
                            t1 = "【问答题】";
                        }
                        if (v.wt_Type == 4) {
                            t1 = "【组合题】";
                        }
                        if (v.wt_Type == 5) {
                            t1 = "【表格题】";
                        }
                        t = v.wt_Title.substr(0, 15);
                        t = t1 + t + "......"
                        sxnu.s4_DataArray.push(new sxnu.DataMode4(t, v.wt_ID, v.wt_PID, v.wt_WJID));
                    });

                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.PageInit = function () {
        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.Load_ST_List();
    }
    sxnu.PageInit();


}
var SXNU_ViewModel_ModifyST = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.wj_ID = ko.observable(0);
    sxnu.sj_ID = ko.observable(0);
    sxnu.g_picExt = [".jpg", ".png", ".gif"];  //(图片格式：jpg、png、gif格式，最佳尺寸130*130;
    sxnu.g_vidoExt = [".flv", ".mp4", ".avi"];   //视频格式：flv、mp4、avi格式，最大支持5M)
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
            formData: {
                wjID: $("#WJ_ID").val(),
            },
            server: '/Admin/Question/SubmitedStep3',
            pick: '#' + element_id + '',
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,png,flv,mp4,avi,doc,docx,xlsx,xls'
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
        $.each(sxnu.Item(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
        });
        $.each(sxnu.other(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
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
        $.each(sxnu.Item2(), function (i, item) {
            var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.Item2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
        });
        $.each(sxnu.other2(), function (i, item) {
            var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!item.item().trim() || !sxnu.IsFZandTime(item.fz())) {
                flag = false;
            }
            $.each(sxnu.other2()[i].pv(), function (ii, item1) {
                Temp.pv.push({ n: item1.n, t: item1.t });
            });
            ItemArray.push(Temp);
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
            wt_Options: ""
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
        sxnu.AnswerList.push(new sxnu.m_a_5("",0));
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
        $.each(sxnu.TitleLsit(), function (i, item) {
            //var Temp = { t: item.item(), f: item.fz(), pv: [] };
            if (!item.t().trim()) {
                flag = false;
            }
            bg.t.push(item.t().trim());
        });
        $.each(sxnu.AnswerList(), function (i, item) {
            //var Temp = { o: 1, t: item.item(), f: item.fz(), pv: [] };
            if (!item.a().trim() || !sxnu.IsFZandTime(item.f())) {
                flag = false;
            }
            bg.a.push({ t: item.a().trim(), f: item.f() });
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
        sxnu.Save_Ajax(fromDataModel);
    }

    //==================表格题   结束=========== 








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
                    var temp = new sxnu.item_model(val.t, val.f);
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
                    var temp = new sxnu.item_model(val.t, val.f);
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
                $.each(item_at.t, function (i,val) {
                    sxnu.TitleLsit.push(new sxnu.m_t_5(val));
                });
                $.each(item_at.a, function (i, val) {
                    sxnu.AnswerList.push(new sxnu.m_a_5(val.t,val.f));
                });
                sxnu.InitUploadContron("filePicker5", "t");
                break;
        }

    }

    sxnu.LoadST_Model = function () {
        if (sxnu.sj_ID() != 0) {
            $.ajax("/Admin/Question/GetSTBy_STID", { async: true, type: "GET", cache: true, data: { ID: sxnu.sj_ID() }, dataType: "json", }).then(function (result) {
                if (result.length==1) {
                    sxnu.Init(result[0]);
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }

    sxnu.PageInit = function () {
        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.sj_ID($("#sj_ID").val());
        $(".type ul li").addClass("type_hover");
        sxnu.LoadST_Model();
    }
    sxnu.PageInit();


}