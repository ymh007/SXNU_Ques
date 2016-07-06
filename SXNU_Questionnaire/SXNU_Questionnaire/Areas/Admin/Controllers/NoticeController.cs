using SXNU_Questionnaire.Areas.Admin.Models;
using SXNU_Questionnaire.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SXNU_Questionnaire.Areas.Admin.Controllers
{
    public class NoticeController : Controller
    {
        //
        // GET: /Admin/Notice/
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult NoticeList()
        {
            return View();
        }

        public ActionResult CreateNotice()
        {

            return View();
        }

        public ActionResult DeleteNotice(int ID) 
        {
            JsMessage jm = new JsMessage();
            string ResultStr = string.Empty;  
            jm = Sql_NoticeManage.Delete_Notice(ID);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }


        public ActionResult ModifyNotice(int ID)
        { 
            DataTable dt = SqlStr_Process.GetListByPage("[SXNU_Questionnaire].[dbo].[Notice]", "no_ID=" + ID, "no_ID", 0, 2);
            if (dt.Rows.Count != 0) {
                ViewBag.noID = ID;
                ViewBag.noTitle = dt.Rows[0]["no_Title"].ToString();
                ViewBag.noContent = dt.Rows[0]["no_Content"].ToString();
            }
            return View();
        }

        public ActionResult ShowNoticeListByPage(QueryModel Q)
        {

            String ResultJson = "";
            string StrWhere = "";
            if (!string.IsNullOrEmpty(Q.StrWhere))
            {
                StrWhere = "no_Title　like '%" + Q.StrWhere + "%'";
            }
            int BeginIndex = Q.CurrenPageIndex == 0 ? 0 : Q.CurrenPageIndex * Q.PageSize + 1;
            int Endindex = BeginIndex + Q.PageSize - (Q.CurrenPageIndex == 0 ? 0 : 1);
            DataTable dt = SqlStr_Process.GetListByPage("[SXNU_Questionnaire].[dbo].[Notice]", StrWhere, "no_ID", BeginIndex, Endindex);
            int TotalRecords = SqlStr_Process.GetTotalRecord("[SXNU_Questionnaire].[dbo].[Notice]", StrWhere);
            int TotalPages = TotalRecords / Q.PageSize + (TotalRecords % Q.PageSize == 0 ? 0 : 1);
            ResultJson = "{\"Data\":" + JsonTool.DtToJson(dt) + ", \"TotalRecords\":" + TotalRecords + ",\"TotalPages\":" + TotalPages + "}";
            return Content(ResultJson.ToString());
        }
         

        public ActionResult Add_Notice(NoticeInfo No) 
        {
            JsMessage jm = new JsMessage();
            string ResultStr = string.Empty;
            if (No.No_ID != 0)
            {
                jm = Sql_NoticeManage.Modify_Notice(No);
            }
            else
            {
                No.No_PublicTime = DateTime.Now.ToString();
                jm = Sql_NoticeManage.Add_Notice(No);
            }
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
             
        }

    }
}
