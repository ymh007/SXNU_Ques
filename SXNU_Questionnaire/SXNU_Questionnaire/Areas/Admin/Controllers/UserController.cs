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
    [AdminFilter]
    public class UserController : Controller
    {
        //
        // GET: /Admin/User/

        public ActionResult ChangePWD()
        {
            return View();
        }

        public ActionResult AccountManage()
        {

            return View();
        }

        public ActionResult AccountCreate()
        {
            return View();
        }

        public ActionResult AccountModify(int ID, string loginName, string Email)
        {
            ViewBag.m_ID = ID;
            ViewBag.m_loginName = loginName;
            ViewBag.m_Email = Email; 
            return View();
        }

        public ActionResult CheckUserIsExist(string LoginName) 
        {
           
            string ResultStr = string.Empty;
            JsMessage jm = Sql_AccounrManage.CheckUserIsExist(LoginName);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }
        public ActionResult ChangePWD_DB(UserInfo user)
        {

            string ResultStr = string.Empty;
            JsMessage jm = new JsMessage();
            string dbpwd = Sql_AccounrManage.OldPWD_NewPWD(user.U_LoginName);
            if (dbpwd == user.U_PWD)
            {
                jm = Sql_AccounrManage.ChangePWD(user);
            }
            else {
                jm.IsSuccess = false;
                jm.ErrorMsg = "原始密码不正确";
            }
            
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }

        public ActionResult AddAccount(UserInfo u) 
        {
            JsMessage jm=new JsMessage ();
            string ResultStr = string.Empty;
            if (u.U_ID != 0)
            {
                jm = Sql_AccounrManage.Modify_Userinfo(u);
            }
            else 
            {
                u.CreateTime = DateTime.Now.ToString();
                u.U_Role = "1";
                u.U_PWD = Rand.Str(6, true);
                jm= Sql_AccounrManage.Add_Userinfo(u);
                
                
            }
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
           
        }

        public ActionResult ShowAccountListByPage(QueryModel Q)
        {

            String ResultJson = "";
            string StrWhere = "";
            if(!string.IsNullOrEmpty(Q.StrWhere))
            {
                StrWhere = "am_LoginUser　like '%" + Q.StrWhere + "%' or am_Email like '%" + Q.StrWhere + "%'";
            } 
            int BeginIndex = Q.CurrenPageIndex == 0 ?0 : Q.CurrenPageIndex * Q.PageSize+1;
            int Endindex = BeginIndex + Q.PageSize - (Q.CurrenPageIndex == 0 ? 0 : 1);
            DataTable dt = SqlStr_Process.GetListByPage("[SXNU_Questionnaire].[dbo].[AccountManage]", StrWhere, "am_ID", BeginIndex, Endindex);
            int TotalRecords = SqlStr_Process.GetTotalRecord("[SXNU_Questionnaire].[dbo].[AccountManage]", StrWhere);
            int TotalPages = TotalRecords / Q.PageSize + (TotalRecords % Q.PageSize == 0 ? 0 : 1);
            ResultJson = "{\"Data\":" + JsonTool.DtToJson(dt) + ", \"TotalRecords\":" + TotalRecords + ",\"TotalPages\":" + TotalPages + "}";
            return Content(ResultJson.ToString());
        }
         

        public ActionResult EnableAccount(int ID) 
        {
            JsMessage jm = new JsMessage();
            string ResultStr = string.Empty;
            jm = Sql_AccounrManage.EnableAccount(ID);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }


        public ActionResult ResetPwd(int ID)
        {
            JsMessage jm = new JsMessage();
            string ResultStr = string.Empty;
            jm = Sql_AccounrManage.ResetPwd(ID);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }
         
    }
}
