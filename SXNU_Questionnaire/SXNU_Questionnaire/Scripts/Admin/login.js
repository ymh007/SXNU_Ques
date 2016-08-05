var SXNU_ViewModel_login = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.ErrorMsg = ko.observable("");
    sxnu.Loginuser = ko.observable("");
    sxnu.Pwd = ko.observable("");
    sxnu.V_Code = ko.observable("");
    sxnu.InvaildStr = function (val) {
        var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/;
        if (patrn.test(val)) {
            return true;
        }
        return false;
    }
    sxnu.ChangeCode = function () {
        var code = $("#imgCode").attr("src");
        $("#imgCode").attr("src", code + "1");
    }
    sxnu.Login = function (flg) {
        sxnu.Loginuser($.trim(sxnu.Loginuser()));
        sxnu.Pwd($.trim(sxnu.Pwd()))
        sxnu.V_Code($.trim(sxnu.V_Code()))
        if (!sxnu.Loginuser() || !sxnu.Pwd() || !sxnu.V_Code()) {
            $("#ErrorMsg").html("登陆信息不完整！");
            return false;
        }
        if (sxnu.InvaildStr(sxnu.Loginuser())) {
            $("#ErrorMsg").html("用户名不能包含特殊字符！");
            return false;
        }
        if (sxnu.InvaildStr(sxnu.V_Code())) {
            $("#ErrorMsg").html("验证码不能包含特殊字符！");
            return false;
        }
        return true;
        //var UserInfo = {
        //    //U_ID :"",
        //    U_LoginName: sxnu.Loginuser(),
        //    U_PWD: ""
        //    //U_Name :"",
        //    //U_Email :"",
        //    //U_Phone :"",
        //    //U_Status :"",
        //    //U_Role :"",
        //}

        //$.ajax("/Admin/Login/Vali_Login", { async: true, type: "GET", cache: true, data: UserInfo, dataType: "json", }).then(function (result) {
        //    if (result) {
        //        if (result.length == 1) {
        //            if (result[0].U_LoginName == sxnu.Loginuser() && result[0].U_LoginName ) {

        //            }
        //        }
        //    }
        //    sxnu.InitEffect();
        //}).fail(function () {
        //    alert("系统异常！");
        //});
        //window.location.href = "/Admin/Question/QuesList";
    }

}