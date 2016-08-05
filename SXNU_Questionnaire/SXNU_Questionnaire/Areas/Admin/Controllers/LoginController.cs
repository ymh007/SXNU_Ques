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
    public class LoginController : Controller
    {
        //
        // GET: /Admin/Login/
     
        public ActionResult Login()
        {
            UserInfo user = new UserInfo();
            user.U_LoginName = Request.Form["user"];
            user.U_PWD = Request.Form["pwd"];
            string Code = Request.Form["code"];
            if (string.IsNullOrEmpty(user.U_LoginName) || string.IsNullOrEmpty(user.U_PWD)) { return View(); }
            try
            {
                if (Session["ValidateCode"].ToString().ToLower() != Code.ToLower())
                {
                    ViewData["ErrorMsg"] = "验证码错误";
                    return View();
                }
            }
            catch(Exception ex)
            {
                return View();
            }
            DataTable dt = SqlStr_Process.GetLoginInfo(user);
            if (dt != null)
            {
                if (dt.Rows.Count == 1)
                {
                    user.U_Role = dt.Rows[0]["am_Role"].ToString();
                    user.U_Status = dt.Rows[0]["am_Status"].ToString();
                    if (user.U_Status == "n") 
                    {
                        ViewData["ErrorMsg"] = "账号已被禁用";
                        return View();
                    }
                    user.U_Email = dt.Rows[0]["am_Email"].ToString();
                    user.U_Phone = dt.Rows[0]["am_Phone"].ToString();
                    user.U_Name = dt.Rows[0]["am_Name"].ToString();
                    user.U_ID =int.Parse(dt.Rows[0]["am_ID"].ToString());

                    Session["UserInfo"] = user;
                    return RedirectToAction("QuesList", "Question");
                }
                else
                {
                    ViewData["ErrorMsg"] = "用户名或密码错误";
                    return View();
                }
            }
            else
            {
                ViewData["ErrorMsg"] = "系统错误";
                return View();
            }
           
        }


        public ActionResult GetCode()
        {
            //生成验证码
            YZMHelper yzm = new YZMHelper();
            Session["ValidateCode"] = yzm.Text;
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            yzm.Image.Save(ms, System.Drawing.Imaging.ImageFormat.Bmp);
            return File(ms.GetBuffer(), @"image/jpeg");
        }

        

    }
}
