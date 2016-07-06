var SXNU_ViewModel_AccountManage = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.isProject_QA = ko.observable(false);


    sxnu.userName = ko.observable();
    sxnu.userEmail = ko.observable();
    sxnu.userName_error_des = ko.observable();
    sxnu.userEmail_error_des = ko.observable();
    sxnu.userName_vis = ko.observable(false);
    sxnu.userEmail_vis = ko.observable(false);

    sxnu.Temp_User = ko.observable();
    sxnu.SearchValue = ko.observable("");

     
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
        if ((sxnu.am_CurrenPageIndex() + 1) == sxnu.am_TotalPage()) { return  ;}
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
            U_ID:0,
            U_LoginName: sxnu.userName(),
            U_PWD:"123456",
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



    sxnu.PageInit = function () {

        //获取修改数据
        sxnu.userName($("#m_loginname").val()),
        sxnu.userEmail($("#m_email").val()),
        sxnu.Temp_User($("#m_loginname").val());
        sxnu.GetByPageingData();
    } 
    sxnu.PageInit();
    

}


var SXNU_ViewModel_NoticeManage = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.isProject_QA = ko.observable(false);


    sxnu.no_title = ko.observable("");
    sxnu.no_content = ko.observable("");
    
    sxnu.noTitle_vis = ko.observable(false);
    sxnu.noContent_vis = ko.observable(false);

    sxnu.SearchValue = ko.observable("");
    sxnu.BackUserList = function () {
        window.location.href = "/Admin/Notice/NoticeList";
    }


    //==============分页 开始==============
    sxnu.NoticeList = ko.observableArray();

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
        sxnu.NoticeList.removeAll();
        $.ajax("/Admin/Notice/ShowNoticeListByPage", { async: true, cache: false, type: "GET", data: parmentMode, dataType: "json" }).then(function (result) {
            if (result) {
                sxnu.NoticeList(result.Data);
                sxnu.am_TotalPage(result.TotalPages);
                sxnu.am_TotalRecord(result.TotalRecords);
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }
    //==============分页 结束===============
    sxnu.DeleteNotice = function (val) {
        if (!val.no_ID) { return false; }
        if (confirm("你确定要删除吗?")) {
            $.ajax("/Admin/Notice/DeleteNotice", { async: true, type: "GET", data: { ID: val.no_ID }, dataType: "json", }).then(function (result) {
                if (result.IsSucceff) {
                    alert("操作成功");
                    sxnu.GetByPageingData();
                }
            }).fail(function () {
                alert("系统异常！");
            });


        }

    }

    sxnu.SearchNotice = function () {
        sxnu.am_CurrenPageIndex(0);
        sxnu.am_TotalPage(1);
        sxnu.GetByPageingData();
    }
    sxnu.IsCanSubmitNotice = function () {
        var flg = true; 
        if (!sxnu.no_title().trim()) {
            sxnu.noTitle_vis(true);
            flg = false;
        } else {
            sxnu.noTitle_vis(false);
            flg = true;
        }
        if (!sxnu.no_content().trim()) {
            sxnu.noContent_vis(true);
            flg = false;
        } else {
            sxnu.noContent_vis(false);
            flg = true;
        } 
        return flg; 
         
    }
    sxnu.CreateAndModeify = function (noticeMoel,flg) {
        if (!sxnu.IsCanSubmitNotice()) return false;
        $.ajax("/Admin/Notice/Add_Notice", { async: true, type: "POST", data: noticeMoel, dataType: "json", }).then(function (result) {
            if (result) {
                if (result.IsSucceff) {
                    alert(flg == "C" ? "创建成功！" : "修改成功！");
                    window.location.href = "/Admin/Notice/NoticeList";
                } else {
                    alert(flg == "C" ? "创建失败！" : "修改失败！");
                }
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }

    sxnu.Add_Notice = function () {
        var noticeMoel = {
            No_ID: 0,
            No_Title: sxnu.no_title(),
            No_Content: sxnu.no_content(),
            No_PublicTime: "",
            No_IsExpired: "n"
        }
        sxnu.CreateAndModeify(noticeMoel,"C");
    }
    sxnu.Modify_Notice = function () {
        var noticeMoel = {
            No_ID: $("#m_id").val(),
            No_Title: sxnu.no_title(),
            No_Content: sxnu.no_content(),
            No_PublicTime: "",
            No_IsExpired: "n"
        }
        sxnu.CreateAndModeify(noticeMoel,"M");

    }
    sxnu.PageInit = function () {
        //获取修改数据
        sxnu.no_title($("#m_title").val()),
        sxnu.no_content($("#m_content").val()),
        sxnu.GetByPageingData();
    }
    sxnu.PageInit();

}

 