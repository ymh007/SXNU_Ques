var SXNU_ViewModel_Index = function ($, currentDom) {
    var SXNU = currentDom || this;
    SXNU.isProject_QA = ko.observable(false);

    SXNU.name = ko.observable();
    SXNU.age = ko.observable();
    SXNU.birthday = ko.observable();
    SXNU.mark = ko.observable();
    SXNU.address = ko.observable();
    SXNU.Imgurl = ko.observable();
    SXNU.UserInfos = ko.observableArray();



    SXNU.up1 = ko.observable();
    SXNU.up2 = ko.observable();
    SXNU.up3 = ko.observable();
    SXNU.up4 = ko.observable();
     
    
    SXNU.PageInit = function () {

        $(function () {
            //消息举报、删除显示隐藏
            $(".ceng").hide();
            $(".ind_oub ul li").mouseover(function () {
                $(this).find(".ceng").show();
            });
            $(".ind_oub ul li").mouseout(function () {
                $(this).find(".ceng").hide();
            });
        })

    }
    SXNU.PageInit();


}
