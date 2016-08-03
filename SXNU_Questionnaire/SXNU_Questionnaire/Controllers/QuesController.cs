using SXNU_Questionnaire.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SXNU_Questionnaire.Controllers
{
    public class QuesController : Controller
    {
        //
        // GET: /Ques/

        public ActionResult ShowQuesList()
        {
            return View();
        }
        public ActionResult Ques()
        {
            return View();
        }
        public ActionResult QuesDetail()
        {
            return View();
        }
        public ActionResult QuesFirstStep()
        {
            return View();
        }
        public ActionResult QuesTwoStep()
        {
          
            return View();
        }


        public ActionResult GetIndexQuestion()
        {
            string SqlStr = "SELECT TOP 6 wj_ID ,wj_Number,wj_Status,wj_Sponsor,wj_Title,wj_BeginPic,wj_ProjectSource,wj_Time,CONVERT(varchar(100),  wj_ValidStart, 23) As wj_ValidStart,CONVERT(varchar(100),  wj_ValidEnd, 23) As wj_ValidEnd , CONVERT(varchar(100),wj_PublishTime, 23) AS wj_PublishTime,wj_Status,wj_BeginBody,wj_BaseInfo FROM  [dbo].[WJ]  ORDER BY  wj_PublishTime  DESC";
            DataTable dt = SqlStr_Process.GetIndexData(SqlStr);
            if (dt != null)
            {
                dt.Columns.Add("IsExpire");
                DateTime NowDate = DateTime.Now;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    //DateTime start = DateTime.Parse(dt.Rows[i]["wj_ValidStart"].ToString());
                    DateTime end = DateTime.Parse(dt.Rows[i]["wj_ValidEnd"].ToString());
                    if (NowDate > end)
                    {
                        dt.Rows[i]["IsExpire"] = "y";
                    }
                    else
                    {
                        dt.Rows[i]["IsExpire"] = "n";
                    }
                }
            }
            return Content(JsonTool.DtToJson(dt));
        }

    }
}
