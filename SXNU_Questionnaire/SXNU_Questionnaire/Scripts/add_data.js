var SXNU_ViewModel = function ($, currentDom) {
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

     

    SXNU.GetUserInfos = function () {
        $.ajax("/Test/GetUserInfos", { async: true, type: "GET", dataType: "json" }).then(function (result) {
            if (result) {
                SXNU.UserInfos(result);
            } else {

            }
        });
    }

     

    SXNU.DeleteUser = function (rowdata) {

        var UserID=rowdata.id;
        $.ajax("/Test/DeleteUser?ID=" + UserID, { async: true, type: "GET", data: { Id: UserID }, dataType: "json", }).then(function (result) {
            if (result) {
                if (result.IsSucceff) {
                    alert("删除成功！");
                    window.location.href = "/Test/ShowData";
                } else {
                    alert("删除fail！");
                }
            }
        }).fail(function () {
            alert("添加fail！");
        });
    }

    SXNU.Add_Data = function () {
        var add_model = {
            name: SXNU.name(),
            age: SXNU.age(),
            address: SXNU.address(),
            mark: SXNU.mark(),
            birthday: SXNU.birthday()
        }
        $.ajax("/Test/AddData_DB", { async: true, type: "POST", data: add_model, dataType: "json", }).then(function (result) {
            if (result) {
                if (result.IsSucceff) {
                    alert("添加成功！");
                    window.location.href = "/Test/ShowData";
                } else {
                    alert("添加fail！");
                }
            }
        }).fail(function () {
            alert("添加fail！");
        });
         
    }
    SXNU.validate = function () {
        var result = true;
        var fn1 = SXNU.up1().substring(SXNU.up1().lastIndexOf("."));
        var fn2 = SXNU.up2();
        var fn3 = SXNU.up3();
        var fn4 = SXNU.up4();
        if (fn4) {
            result = true;
        } else {
            result = false;
        }
        return result;
       
        
    }
    SXNU.ViewImg = function () {
        $("input[name='filename']").on("change", function () {
            var file = this.files[0];
            if (this.files && file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("#img1").attr("src", e.target.result);
                    $("#fn").text(file.name);
                    $("#fs").text(file.size+"bytes");
                }
                reader.readAsDataURL(file);
            }
        });
    }




    /*
      输入 150 分钟 卷子  9000秒
      每隔5分钟休息 1分钟
      300   60
      休息次数30次

    */

    SXNU.sleep_count = ko.observable(parseInt(30));
    SXNU.sleep_interval = ko.observable(parseInt(15));

    SXNU.intDiff = ko.observable(parseInt(9000));
    SXNU.intDiff1 = ko.observable(parseInt(70));

    SXNU.ReturnVal = ko.observable();
    SXNU.ReturnVal1 = ko.observable();
    SXNU.sleep_ReturnVal = ko.observable();

    //SXNU.showMask =function(elementID) {
    //    $("#" + elementID + "").css("height", $(document).height());
    //    $("#" + elementID + "").css("width", $(document).width());
    //    $("#" + elementID + "").show();
    //}
    
    //SXNU.hideMask = function (elementID) {
    //    $("#" + elementID + "").hide();
    //}
     

    SXNU.StopTime = function () {
        //clearInterval(SXNU.ReturnVal());
        //clearInterval(SXNU.ReturnVal1());
    }

    SXNU.StartTime = function () {
        //SXNU.timer(SXNU.intDiff());
        //SXNU.timer1(SXNU.intDiff1());
    }


    SXNU.StartSleep = function () {
         setTimeout(function () {
            SXNU.timer(SXNU.intDiff());
            SXNU.Sleep(SXNU.sleep_count());
            console.log("休息5 秒钟" + SXNU.sleep_count());
        }, 1000*5);
         
    }

    SXNU.Sleep = function (sleep_Diff) {
        SXNU.sleep_ReturnVal(window.setInterval(function () {
            SXNU.StartSleep();
            SXNU.sleep_count(parseInt(SXNU.sleep_count()-1));
            clearInterval(SXNU.ReturnVal());
            clearInterval(SXNU.sleep_ReturnVal());
            if (SXNU.sleep_count() == 0) {
                clearInterval(SXNU.sleep_ReturnVal());
            }
            console.log("我是控制隔多长时间应该休息的方法" + SXNU.sleep_count());
        }, SXNU.sleep_interval() * 1000));

    }
    SXNU.timer=function(intDiff) {
        SXNU.ReturnVal(window.setInterval(function () {
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
            //$('#day_show').html(day + "天");
            $('#hour_show').html('<s id="h"></s>' + hour + '时');
            $('#minute_show').html('<s></s>' + minute + '分');
            $('#second_show').html('<s></s>' + second + '秒');
            if (SXNU.intDiff() == 0) {
                clearInterval(SXNU.ReturnVal());
                alert("答题时间结束！");
            }
            SXNU.intDiff(intDiff--);
            //alert("你需要休息一下");
        }, 1000));
    }
    SXNU.timer1 = function (intDiff1) {
        SXNU.ReturnVal1(window.setInterval(function () {
            var hour = 0,
                minute = 0,
                second = 0;//时间默认值
            if (intDiff1 > 0) {
                //day = Math.floor(intDiff1 / (60 * 60 * 24));
                hour = Math.floor(intDiff1 / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff1 / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff1) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            //$('#day_show1').html(day + "天");
            $('#hour_show1').html('<s id="h"></s>' + hour + '时');
            $('#minute_show1').html('<s></s>' + minute + '分');
            $('#second_show1').html('<s></s>' + second + '秒');
           
            SXNU.intDiff1(intDiff1--);
            //alert("你需要休息一下");
        }, 1000));
    }



    SXNU.p_CurrenPageIndex = ko.observable(1);//当前第几页
    SXNU.p_PageSize = ko.observable(20); //一页显示多少条数据
    SXNU.p_TotalPage = ko.observable(0); // 页总数
    SXNU.p_TotalRecord = ko.observable();//总记录数

   

    //SXNU.FirstPage = function () {
    //    SXNU.p_CurrenPageIndex(1);
    //    SXNU.GetByPageingData();
    //}
    //SXNU.EndPage = function () {
    //    SXNU.p_CurrenPageIndex(SXNU.p_TotalPage() - 1);
    //    SXNU.GetByPageingData();
    //}

    SXNU.Provider = function () {
        if (SXNU.p_CurrenPageIndex() > 0) {
            SXNU.p_CurrenPageIndex(SXNU.p_CurrenPageIndex() - 1);
            SXNU.GetByPageingData();
        }
    }
    SXNU.NextPage = function () {
        SXNU.p_CurrenPageIndex(SXNU.p_CurrenPageIndex() + 1);
        SXNU.GetByPageingData();
    }
   
    SXNU.GotoPage = function (index) { 
        if (index < 0 || index > (SXNU.p_TotalPage() - 1)) {
            return;
        };
        SXNU.p_CurrenPageIndex(index);
        SXNU.GetByPageingData();
    }
    SXNU.GetByPageingData = function () {
        var parmentMode = {
            CurrenPageIndex: SXNU.p_CurrenPageIndex(),
            PageSize: SXNU.p_PageSize()
        }
        $.ajax("/Test/GetUserInfos", { async: true, type: "GET", data: parmentMode, dataType: "json", }).then(function (result) {
            if (result) {
                SXNU.UserInfos(result.Data);
                SXNU.p_TotalPage(result.TotalPages);
                SXNU.p_TotalRecord(result.TotalRecords);
            }
        }).fail(function () {
            alert("系统异常！");
        });
    }

    SXNU.PageInit = function () {
        //$(window).bind('beforeunload', function () {
        //    return '你确认要离开本页面吗？';
        //});
        SXNU.timer(SXNU.intDiff());
        SXNU.Sleep(SXNU.sleep_count());
        //SXNU.timer1(SXNU.intDiff1());

        //SXNU.GetUserInfos();
        SXNU.GetByPageingData();
        SXNU.ViewImg();
    }
    SXNU.PageInit();


}
 