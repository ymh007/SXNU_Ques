using SXNU_Questionnaire.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SXNU_Questionnaire.Areas.Admin.Models;
namespace SXNU_Questionnaire.Controllers
{
    public class NoticeController : Controller
    {
        //
        // GET: /Notice/

        
        public ActionResult Notice()
        {
            return View();
        }
        public ActionResult NoticeDetail(int ID)
        {
            string SqlStr = "SELECT   *  FROM  [dbo].[Notice]  where no_ID="+ID;
            DataTable dt = SqlStr_Process.GetIndexData(SqlStr);
            NoticeInfo Not = new NoticeInfo();
            if (dt != null)
            {
                Not.No_PublicTime = dt.Rows[0]["No_PublicTime"].ToString();
                Not.No_Title = dt.Rows[0]["No_Title"].ToString();
                Not.No_Content = dt.Rows[0]["No_Content"].ToString().Replace("\n", "<br/>"); 

            }
            else 
            {
                return Content("通知消息不存在！");
            }
            return View(Not);
        }

        public ActionResult GetIndexNotice() 
        {
            string SqlStr = "SELECT  TOP 6 no_ID,no_Title, no_Content,CONVERT(varchar(100),  no_PublicTime, 23) as no_PublicTime ,no_IsExpired FROM [dbo].[Notice] ORDER BY  no_PublicTime DESC";
            DataTable dt = SqlStr_Process.GetIndexData(SqlStr);
            return Content(JsonTool.DtToJson(dt));
        }

        public ActionResult GetNoticeByYear() 
        {
            return Content(SqlStr_Process.ReturnJSONStr());
            
        }

    }
}
