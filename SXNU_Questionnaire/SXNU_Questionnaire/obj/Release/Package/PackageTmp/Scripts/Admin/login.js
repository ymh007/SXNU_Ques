var SXNU_ViewModel_login = function ($, currentDom) {
    var sxnu = currentDom || this;
    sxnu.isProject_QA = ko.observable(false);


    sxnu.userName = ko.observable();
    sxnu.userEmail = ko.observable();
    sxnu.userName_error_des = ko.observable();
    sxnu.userEmail_error_des = ko.observable();
    sxnu.userName_vis = ko.observable(false);
    sxnu.userEmail_vis = ko.observable(false);




    //==============分页 开始==============
    sxnu.accountList = ko.observableArray();

    sxnu.am_CurrenPageIndex = ko.observable(1);//当前第几页
    sxnu.am_PageSize = ko.observable(20); //一页显示多少条数据
    sxnu.am_TotalPage = ko.observable(0); // 页总数
    sxnu.am_TotalRecord = ko.observable();//总记录数

     
 

    sxnu.Login = function (flg) {
        window.location.href = "/Admin/Question/QuesList";
    }
  
}