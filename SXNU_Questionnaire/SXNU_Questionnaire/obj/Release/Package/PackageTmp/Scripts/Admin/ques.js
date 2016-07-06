var SXNU_ViewModel_Ques1 = function ($, currentDom) {
    var sxnu = currentDom || this;
     
   

    //====== 开始step2=======================
    sxnu.ControlsType = ko.observableArray(["文本框", "单选按钮", "下拉菜单"]);
    sxnu.EnumControlsType={
        wbk:"文本框",
        dxan:"单选按钮",
        xlcd:"下拉菜单"
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
    sxnu.IsNumber=function(val){
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
            if (result.IsSucceff) {
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
var SXNU_ViewModel_Ques3 = function ($, currentDom) {
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

    sxnu.s2_DataArray.push(new sxnu.bim("字段1111", "文本框", "11", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段字段", "单选按钮", "xxx字段xxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段", "下拉菜单", "111x字段xxxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "111111111xxxxxxx字段xxxxxxxxxxxxxxx字段xxxxxxxxxxxxx111111字段111", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "下拉菜单", "1111111", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "1xxxxxxxxxxxxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "下拉菜单", "1xx字段xxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "1xxxxxxx字段xxxxxxxxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段1", "下拉菜单", "1xxxxxxxx字段xxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段1字段", "单选按钮", "11xxxxx字段xxxxx", "0"));


    // ======结束step2========================







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

    sxnu.Submited_Step2 = function () {
        if (!sxnu.Validate_Step2()) {
            alert("输入内容有误！");
        }

        var baseInfo = new Array();
        $.each(sxnu.s2_DataArray(), function (index, item) {
            baseInfo.push({ tit: item.b1(), ty: item.b2(), val: item.b3(), ck: item.ck() });
        });
        $.ajax("/Admin/Question/SubmitedStep2", { async: true, type: "POST", cache: false, data: { wj_ID: sxnu.wj_ID(), wj_BaseInfo: JSON.stringify(baseInfo) }, dataType: "json", }).then(function (result) {
            if (result.IsSucceff) {
                alert("提交成功");
                window.location.href = "/Admin/Question/Step3?ID=" + sxnu.wj_ID();
            } else {
                alert("提交成功");
            }
        }).fail(function () {
            alert("提交失败！");
        });


    }
    sxnu.Submited_Step3 = function () {
        window.location.href = "/Admin/Question/Step4";
    }

    sxnu.Submited_Step4 = function () {
        window.location.href = "/Admin/Question/QuesList";
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
        $.ajax("/Admin/User/ShowAccountListByPage", { async: true, cache: false, type: "GET", data: parmentMode, dataType: "json" }).then(function (result) {
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

    //sxnu.RedirModidy = function (val) {
    //    window.location.href = "/Admin/User/AccountModify?ID=" + val.am_ID + "&loginName=" + encodeURIComponent(val.am_LoginUser) + "&Email=" + encodeURIComponent( val.am_Email) + "";
    //}

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

    sxnu.SearchAccount = function () {
        if (sxnu.InvaildStr(sxnu.SearchValue())) {
            alert("输入内容包含非法字符串！");
            return false;
        }
        sxnu.am_CurrenPageIndex(0);
        sxnu.am_TotalPage(1);
        sxnu.GetByPageingData();
    }


    sxnu.Login = function (flg) {
        window.location.href = "/Admin/Home/Home";
    }




    sxnu.CheckUserIsExist = function () {
        if (sxnu.userName()) {
            $.ajax("/Admin/User/CheckUserIsExist", { async: true, type: "GET", data: { LoginName: sxnu.userName() }, dataType: "json" }).then(function (result) {
                if (result.IsExist) {
                    sxnu.userName_vis(true);
                    sxnu.UserIsExits(true);
                    sxnu.userName_error_des("用户名已存在");
                } else {
                    sxnu.userName_vis(false);
                    sxnu.UserIsExits(false);
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }

    sxnu.M_CheckUserIsExist = function () {
        if (sxnu.Temp_User() == sxnu.userName().trim()) {
            return false;
        }
        if (sxnu.userName()) {
            $.ajax("/Admin/User/CheckUserIsExist", { async: true, cache: false, type: "GET", data: { LoginName: sxnu.userName() }, dataType: "json", }).then(function (result) {
                if (result.IsExist) {
                    sxnu.userName_vis(true);
                    sxnu.UserIsExits(true);
                    sxnu.userName_error_des("用户名已存在");
                } else {
                    sxnu.userName_vis(false);
                    sxnu.UserIsExits(false);
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.CreateAccount = function () {
        var userModel = {
            U_ID: 0,
            U_LoginName: sxnu.userName(),
            U_PWD: "123456",
            U_Name: "",
            U_Email: sxnu.userEmail(),
            U_Phone: "",
            U_Status: "y",
            CreateTime: ""
        };
        sxnu.AddAndModify(userModel, "C");
    }

    sxnu.BackUserList = function () {
        window.location.href = "/Admin/User/AccountManage";
    }


    sxnu.EnableAccount = function (val) {
        $.ajax("/Admin/User/EnableAccount", { async: true, type: "GET", data: { ID: val.am_ID }, dataType: "json", }).then(function (result) {
            if (result.IsSucceff) {
                alert("操作成功");
                sxnu.GetByPageingData();
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    sxnu.ResetPwd = function (val) {
        $.ajax("/Admin/User/ResetPwd", { async: true, type: "GET", data: { ID: val.am_ID }, dataType: "json", }).then(function (result) {
            if (result.IsSucceff) {
                alert("操作成功");
                sxnu.BackUserList();
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }


    sxnu.ModifyAccount = function () {
        var userModel = {
            U_ID: $("#m_id").val(),
            U_LoginName: sxnu.userName(),
            U_PWD: "123456",
            U_Name: "",
            U_Email: sxnu.userEmail(),
            U_Phone: "",
            U_Status: "y",
            CreateTime: ""
        };
        sxnu.AddAndModify(userModel, "M");
    }

    sxnu.AddAndModify = function (UserModel, flg) {
        if (sxnu.UserIsExits()) { return false };
        if (sxnu.ValidateData(sxnu.userName(), sxnu.userEmail())) {
            $.ajax("/Admin/User/AddAccount", { async: true, type: "POST", cache: false, data: UserModel, dataType: "json", }).then(function (result) {
                if (result) {
                    if (result.IsSucceff) {
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
    sxnu.ValidateData = function (user, email) {
        var flg = true;
        var EmailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!user) {
            sxnu.userName_vis(true);
            sxnu.userName_error_des("用户名不能为空");
            flg = false;
        } else {
            sxnu.userName_vis(false);
            flg = true;
        }

        //if (!email) {
        //    sxnu.userEmail_vis(true);
        //    sxnu.userEmail_error_des("邮箱不能为空");
        //    flg = false;
        //}
        if (!EmailReg.test(email)) {
            sxnu.userEmail_vis(true);
            sxnu.userEmail_error_des("邮箱格式不正确");
            flg = false;
        } else {
            sxnu.userEmail_vis(false);
            flg = true;
        }
        return flg;
    }

    //  上传封面图片
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
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.PageInit = function () {

        //获取修改数据
        sxnu.userName($("#m_loginname").val());
        sxnu.userEmail($("#m_email").val());
        sxnu.Temp_User($("#m_loginname").val());
        $("#ValidStart").datepicker({ dateFormat: 'yy-mm-dd' });
        $("#ValidEnd").datepicker({ dateFormat: 'yy-mm-dd' });
        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.LoadWJ();
        //sxnu.GetByPageingData();
        sxnu.ViewImg();
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

    sxnu.s2_DataArray.push(new sxnu.bim("字段1111", "文本框", "11", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段字段", "单选按钮", "xxx字段xxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段", "下拉菜单", "111x字段xxxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "111111111xxxxxxx字段xxxxxxxxxxxxxxx字段xxxxxxxxxxxxx111111字段111", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "下拉菜单", "1111111", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "1xxxxxxxxxxxxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "下拉菜单", "1xx字段xxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "1xxxxxxx字段xxxxxxxxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段1", "下拉菜单", "1xxxxxxxx字段xxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段1字段", "单选按钮", "11xxxxx字段xxxxx", "0"));


    // ======结束step2========================







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

    sxnu.Submited_Step2 = function () {
        if (!sxnu.Validate_Step2()) {
            alert("输入内容有误！");
        }

        var baseInfo = new Array();
        $.each(sxnu.s2_DataArray(), function (index, item) {
            baseInfo.push({ tit: item.b1(), ty: item.b2(), val: item.b3(), ck: item.ck() });
        });
        $.ajax("/Admin/Question/SubmitedStep2", { async: true, type: "POST", cache: false, data: { wj_ID: sxnu.wj_ID(), wj_BaseInfo: JSON.stringify(baseInfo) }, dataType: "json", }).then(function (result) {
            if (result.IsSucceff) {
                alert("提交成功");
                window.location.href = "/Admin/Question/Step3?ID=" + sxnu.wj_ID();
            } else {
                alert("提交成功");
            }
        }).fail(function () {
            alert("提交失败！");
        });


    }
    sxnu.Submited_Step3 = function () {
        window.location.href = "/Admin/Question/Step4";
    }

    sxnu.Submited_Step4 = function () {
        window.location.href = "/Admin/Question/QuesList";
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
        $.ajax("/Admin/User/ShowAccountListByPage", { async: true, cache: false, type: "GET", data: parmentMode, dataType: "json" }).then(function (result) {
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

    //sxnu.RedirModidy = function (val) {
    //    window.location.href = "/Admin/User/AccountModify?ID=" + val.am_ID + "&loginName=" + encodeURIComponent(val.am_LoginUser) + "&Email=" + encodeURIComponent( val.am_Email) + "";
    //}

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

    sxnu.SearchAccount = function () {
        if (sxnu.InvaildStr(sxnu.SearchValue())) {
            alert("输入内容包含非法字符串！");
            return false;
        }
        sxnu.am_CurrenPageIndex(0);
        sxnu.am_TotalPage(1);
        sxnu.GetByPageingData();
    }


    sxnu.Login = function (flg) {
        window.location.href = "/Admin/Home/Home";
    }




    sxnu.CheckUserIsExist = function () {
        if (sxnu.userName()) {
            $.ajax("/Admin/User/CheckUserIsExist", { async: true, type: "GET", data: { LoginName: sxnu.userName() }, dataType: "json" }).then(function (result) {
                if (result.IsExist) {
                    sxnu.userName_vis(true);
                    sxnu.UserIsExits(true);
                    sxnu.userName_error_des("用户名已存在");
                } else {
                    sxnu.userName_vis(false);
                    sxnu.UserIsExits(false);
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }

    sxnu.M_CheckUserIsExist = function () {
        if (sxnu.Temp_User() == sxnu.userName().trim()) {
            return false;
        }
        if (sxnu.userName()) {
            $.ajax("/Admin/User/CheckUserIsExist", { async: true, cache: false, type: "GET", data: { LoginName: sxnu.userName() }, dataType: "json", }).then(function (result) {
                if (result.IsExist) {
                    sxnu.userName_vis(true);
                    sxnu.UserIsExits(true);
                    sxnu.userName_error_des("用户名已存在");
                } else {
                    sxnu.userName_vis(false);
                    sxnu.UserIsExits(false);
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.CreateAccount = function () {
        var userModel = {
            U_ID: 0,
            U_LoginName: sxnu.userName(),
            U_PWD: "123456",
            U_Name: "",
            U_Email: sxnu.userEmail(),
            U_Phone: "",
            U_Status: "y",
            CreateTime: ""
        };
        sxnu.AddAndModify(userModel, "C");
    }

    sxnu.BackUserList = function () {
        window.location.href = "/Admin/User/AccountManage";
    }


    sxnu.EnableAccount = function (val) {
        $.ajax("/Admin/User/EnableAccount", { async: true, type: "GET", data: { ID: val.am_ID }, dataType: "json", }).then(function (result) {
            if (result.IsSucceff) {
                alert("操作成功");
                sxnu.GetByPageingData();
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    sxnu.ResetPwd = function (val) {
        $.ajax("/Admin/User/ResetPwd", { async: true, type: "GET", data: { ID: val.am_ID }, dataType: "json", }).then(function (result) {
            if (result.IsSucceff) {
                alert("操作成功");
                sxnu.BackUserList();
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }


    sxnu.ModifyAccount = function () {
        var userModel = {
            U_ID: $("#m_id").val(),
            U_LoginName: sxnu.userName(),
            U_PWD: "123456",
            U_Name: "",
            U_Email: sxnu.userEmail(),
            U_Phone: "",
            U_Status: "y",
            CreateTime: ""
        };
        sxnu.AddAndModify(userModel, "M");
    }

    sxnu.AddAndModify = function (UserModel, flg) {
        if (sxnu.UserIsExits()) { return false };
        if (sxnu.ValidateData(sxnu.userName(), sxnu.userEmail())) {
            $.ajax("/Admin/User/AddAccount", { async: true, type: "POST", cache: false, data: UserModel, dataType: "json", }).then(function (result) {
                if (result) {
                    if (result.IsSucceff) {
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
    sxnu.ValidateData = function (user, email) {
        var flg = true;
        var EmailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!user) {
            sxnu.userName_vis(true);
            sxnu.userName_error_des("用户名不能为空");
            flg = false;
        } else {
            sxnu.userName_vis(false);
            flg = true;
        }

        //if (!email) {
        //    sxnu.userEmail_vis(true);
        //    sxnu.userEmail_error_des("邮箱不能为空");
        //    flg = false;
        //}
        if (!EmailReg.test(email)) {
            sxnu.userEmail_vis(true);
            sxnu.userEmail_error_des("邮箱格式不正确");
            flg = false;
        } else {
            sxnu.userEmail_vis(false);
            flg = true;
        }
        return flg;
    }

    //  上传封面图片
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
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.PageInit = function () {

        //获取修改数据
        sxnu.userName($("#m_loginname").val());
        sxnu.userEmail($("#m_email").val());
        sxnu.Temp_User($("#m_loginname").val());
        $("#ValidStart").datepicker({ dateFormat: 'yy-mm-dd' });
        $("#ValidEnd").datepicker({ dateFormat: 'yy-mm-dd' });
        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.LoadWJ();
        //sxnu.GetByPageingData();
        sxnu.ViewImg();
    }
    sxnu.PageInit();


}

var SXNU_ViewModel_Ques_back = function ($, currentDom) {
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

    sxnu.s2_DataArray.push(new sxnu.bim("字段1111", "文本框", "11", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段字段", "单选按钮", "xxx字段xxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段", "下拉菜单", "111x字段xxxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "111111111xxxxxxx字段xxxxxxxxxxxxxxx字段xxxxxxxxxxxxx111111字段111", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "下拉菜单", "1111111", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "1xxxxxxxxxxxxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "下拉菜单", "1xx字段xxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("1字段", "单选按钮", "1xxxxxxx字段xxxxxxxxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段1", "下拉菜单", "1xxxxxxxx字段xxx", "0"));
    sxnu.s2_DataArray.push(new sxnu.bim("字段1字段", "单选按钮", "11xxxxx字段xxxxx", "0"));


    // ======结束step2========================







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

    sxnu.Submited_Step2 = function () {
        if (!sxnu.Validate_Step2()) {
            alert("输入内容有误！");
        }

        var baseInfo = new Array();
        $.each(sxnu.s2_DataArray(), function (index, item) {
            baseInfo.push({ tit: item.b1(), ty: item.b2(), val: item.b3(), ck: item.ck() });
        });
        $.ajax("/Admin/Question/SubmitedStep2", { async: true, type: "POST", cache: false, data: { wj_ID: sxnu.wj_ID(), wj_BaseInfo: JSON.stringify(baseInfo) }, dataType: "json", }).then(function (result) {
            if (result.IsSucceff) {
                alert("提交成功");
                window.location.href = "/Admin/Question/Step3?ID=" + sxnu.wj_ID();
            } else {
                alert("提交成功");
            }
        }).fail(function () {
            alert("提交失败！");
        });


    }
    sxnu.Submited_Step3 = function () {
        window.location.href = "/Admin/Question/Step4";
    }

    sxnu.Submited_Step4 = function () {
        window.location.href = "/Admin/Question/QuesList";
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
        $.ajax("/Admin/User/ShowAccountListByPage", { async: true, cache: false, type: "GET", data: parmentMode, dataType: "json" }).then(function (result) {
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

    //sxnu.RedirModidy = function (val) {
    //    window.location.href = "/Admin/User/AccountModify?ID=" + val.am_ID + "&loginName=" + encodeURIComponent(val.am_LoginUser) + "&Email=" + encodeURIComponent( val.am_Email) + "";
    //}

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

    sxnu.SearchAccount = function () {
        if (sxnu.InvaildStr(sxnu.SearchValue())) {
            alert("输入内容包含非法字符串！");
            return false;
        }
        sxnu.am_CurrenPageIndex(0);
        sxnu.am_TotalPage(1);
        sxnu.GetByPageingData();
    }


    sxnu.Login = function (flg) {
        window.location.href = "/Admin/Home/Home";
    }




    sxnu.CheckUserIsExist = function () {
        if (sxnu.userName()) {
            $.ajax("/Admin/User/CheckUserIsExist", { async: true, type: "GET", data: { LoginName: sxnu.userName() }, dataType: "json" }).then(function (result) {
                if (result.IsExist) {
                    sxnu.userName_vis(true);
                    sxnu.UserIsExits(true);
                    sxnu.userName_error_des("用户名已存在");
                } else {
                    sxnu.userName_vis(false);
                    sxnu.UserIsExits(false);
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }

    sxnu.M_CheckUserIsExist = function () {
        if (sxnu.Temp_User() == sxnu.userName().trim()) {
            return false;
        }
        if (sxnu.userName()) {
            $.ajax("/Admin/User/CheckUserIsExist", { async: true, cache: false, type: "GET", data: { LoginName: sxnu.userName() }, dataType: "json", }).then(function (result) {
                if (result.IsExist) {
                    sxnu.userName_vis(true);
                    sxnu.UserIsExits(true);
                    sxnu.userName_error_des("用户名已存在");
                } else {
                    sxnu.userName_vis(false);
                    sxnu.UserIsExits(false);
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.CreateAccount = function () {
        var userModel = {
            U_ID: 0,
            U_LoginName: sxnu.userName(),
            U_PWD: "123456",
            U_Name: "",
            U_Email: sxnu.userEmail(),
            U_Phone: "",
            U_Status: "y",
            CreateTime: ""
        };
        sxnu.AddAndModify(userModel, "C");
    }

    sxnu.BackUserList = function () {
        window.location.href = "/Admin/User/AccountManage";
    }


    sxnu.EnableAccount = function (val) {
        $.ajax("/Admin/User/EnableAccount", { async: true, type: "GET", data: { ID: val.am_ID }, dataType: "json", }).then(function (result) {
            if (result.IsSucceff) {
                alert("操作成功");
                sxnu.GetByPageingData();
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    sxnu.ResetPwd = function (val) {
        $.ajax("/Admin/User/ResetPwd", { async: true, type: "GET", data: { ID: val.am_ID }, dataType: "json", }).then(function (result) {
            if (result.IsSucceff) {
                alert("操作成功");
                sxnu.BackUserList();
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }


    sxnu.ModifyAccount = function () {
        var userModel = {
            U_ID: $("#m_id").val(),
            U_LoginName: sxnu.userName(),
            U_PWD: "123456",
            U_Name: "",
            U_Email: sxnu.userEmail(),
            U_Phone: "",
            U_Status: "y",
            CreateTime: ""
        };
        sxnu.AddAndModify(userModel, "M");
    }

    sxnu.AddAndModify = function (UserModel, flg) {
        if (sxnu.UserIsExits()) { return false };
        if (sxnu.ValidateData(sxnu.userName(), sxnu.userEmail())) {
            $.ajax("/Admin/User/AddAccount", { async: true, type: "POST", cache: false, data: UserModel, dataType: "json", }).then(function (result) {
                if (result) {
                    if (result.IsSucceff) {
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
    sxnu.ValidateData = function (user, email) {
        var flg = true;
        var EmailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!user) {
            sxnu.userName_vis(true);
            sxnu.userName_error_des("用户名不能为空");
            flg = false;
        } else {
            sxnu.userName_vis(false);
            flg = true;
        }

        //if (!email) {
        //    sxnu.userEmail_vis(true);
        //    sxnu.userEmail_error_des("邮箱不能为空");
        //    flg = false;
        //}
        if (!EmailReg.test(email)) {
            sxnu.userEmail_vis(true);
            sxnu.userEmail_error_des("邮箱格式不正确");
            flg = false;
        } else {
            sxnu.userEmail_vis(false);
            flg = true;
        }
        return flg;
    }

    //  上传封面图片
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
                }
            }).fail(function () {
                alert("系统异常！");
            });
        }
    }


    sxnu.PageInit = function () {

        //获取修改数据
        sxnu.userName($("#m_loginname").val());
        sxnu.userEmail($("#m_email").val());
        sxnu.Temp_User($("#m_loginname").val());
        $("#ValidStart").datepicker({ dateFormat: 'yy-mm-dd' });
        $("#ValidEnd").datepicker({ dateFormat: 'yy-mm-dd' });
        sxnu.wj_ID($("#WJ_ID").val());
        sxnu.LoadWJ();
        //sxnu.GetByPageingData();
        sxnu.ViewImg();
    }
    sxnu.PageInit();


}