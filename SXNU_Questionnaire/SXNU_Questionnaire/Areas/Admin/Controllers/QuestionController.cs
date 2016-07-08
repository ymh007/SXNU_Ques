using SXNU_Questionnaire.Areas.Admin.Models;
using SXNU_Questionnaire.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SXNU_Questionnaire.Areas.Admin.Controllers
{
    public class QuestionController : Controller
    {
        //
        // GET: /Admin/Question/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AnswerDetails()
        {
            return View();
        }


        public ActionResult QuesList()
        {
            return View();
        }

        public ActionResult Step1(int ID)
        {
            ViewBag.WJ_ID = ID;
            return View();
        }

        public ActionResult Step2(int ID)
        {
            if (ID > 0)
            {
                ViewBag.WJ_ID = ID;
                return View();
            }
            else
            {
                return RedirectToAction("Step1", "Question", new { ID = 0 });
            }

        }
        public ActionResult Step3(int ID)
        {
            if (ID > 0)
            {
                ViewBag.WJ_ID = ID;
                return View();
            }
            else
            {
                return RedirectToAction("Step1", "Question", new { ID = 0 });
            }
        }
        public ActionResult Step4(int ID)
        {
            if (ID > 0)
            {
                ViewBag.WJ_ID = ID;
                return View();
            }
            else
            {
                return RedirectToAction("Step1", "Question", new { ID = 0 });
            }
        }


        public ActionResult GetWJByID(int ID)
        {
            string Fields = "wj_ID ,wj_Number,wj_Status,wj_Title,wj_BeginPic,wj_ProjectSource,wj_Time, CONVERT(varchar(100),  wj_ValidStart, 23) As wj_ValidStart,CONVERT(varchar(100),  wj_ValidEnd, 23) As wj_ValidEnd ,wj_BeginBody,wj_BaseInfo";
            DataTable dt = SqlStr_Process.GetListByPage("[SXNU_Questionnaire].[dbo].[WJ]", Fields, "wj_ID=" + ID, "wj_ID", 0, 2);
            return Content(JsonTool.DtToJson(dt));
        }

        public ActionResult SubmitedStep1()
        {

            QuestionInfo wj = new QuestionInfo();
            wj.wj_ID = int.Parse(Request.Form["wj_ID"]);
            wj.wj_Number = SXNU_Questionnaire.Common.Rand.Str(13, true);
            wj.wj_Title = Request.Form["wj_Title"];
            wj.wj_ProjectSource = Request.Form["wj_ProjectSource"];
            wj.wj_Time = Request.Form["wj_Time"];
            wj.wj_ValidStart = Request.Form["wj_ValidStart"];
            wj.wj_ValidEnd = Request.Form["wj_ValidEnd"];
            wj.wj_BeginBody = Request.Form["wj_BeginBody"];

            wj.wj_BeginPic = "fc";
            if (Request.Files.Count > 0)
            {
                if (Request.Files[0].ContentLength > 0)
                {
                    var file = Request.Files[0];
                    string FileType = Path.GetExtension(file.FileName);
                    wj.wj_BeginPic = wj.wj_BeginPic + FileType;
                }
            }

            // 初始化参数
            wj.wj_BaseInfo = "";
            wj.wj_EndBody = "";
            wj.wj_PageSize = "";
            wj.wj_Status = "C";
            wj.wj_Sponsor = "";
            wj.wj_PublishTime = DateTime.Now.ToString();

            #region   添加和修改问卷


            JsMessage jm = new JsMessage();
            if (wj.wj_ID != 0)
            {
                jm = Sql_QuestionManage.Modify_Question(wj);
            }
            else
            {
                jm = Sql_QuestionManage.Add_Question(wj);
                wj.wj_ID = jm.ReturnADD_ID;
            }
            #endregion

            #region 上传封面图片
            string PhysicalPath = Path.Combine(Request.MapPath("~/WJ_Attachment/"), wj.wj_ID.ToString());
            if (!Directory.Exists(PhysicalPath))
            {
                Directory.CreateDirectory(PhysicalPath);
            }

            if (Request.Files.Count > 0)
            {
                if (Request.Files[0].ContentLength > 0)
                {
                    var file = Request.Files[0];
                    string SavePath = Path.Combine(PhysicalPath, wj.wj_BeginPic);
                    try
                    {
                        file.SaveAs(SavePath);
                    }
                    catch
                    {
                        return Content("上传异常 ！", "text/plain");
                    }
                }
            }
            #endregion

            if (jm.IsSuccess)
            {
                return RedirectToAction("Step2", "Question", new { ID = wj.wj_ID });
            }
            else
            {
                return Content("系统异常 ！", "text/plain");
            }

        }




        public ActionResult SubmitedStep2(QuestionInfo wj)
        {

            JsMessage jm = new JsMessage();
            string ResultStr = string.Empty;
            jm = Sql_QuestionManage.Modify_Question_BaseInfo(wj);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }

        public ActionResult SubmitedStep3(string id, int wjID, string name, string type, string lastModifiedDate, int size, HttpPostedFileBase file)
        {
            if (Request.Files.Count == 0)
            {
                return Json(new { jsonrpc = 2.0, error = new { code = 102, message = "保存失败" }, id = "id" });
            }
            string PhysicalPath = Path.Combine(Request.MapPath("~/WJ_Attachment/"), wjID.ToString());
            if (!Directory.Exists(PhysicalPath))
            {
                Directory.CreateDirectory(PhysicalPath);
            }
            string filePathName = string.Empty;
            string ex = Path.GetExtension(file.FileName);
            filePathName = DateTime.Now.ToString("yyyyMMddhhmmss") + DateTime.Now.Millisecond.ToString() + ex;
            file.SaveAs(Path.Combine(PhysicalPath, filePathName));
            return Json(new
            { 
                id = id,
                fileName = filePathName
            });

        }
        public ActionResult DeleteFile(string FilePath)
        {
            string PhysicalPath = Path.Combine(Request.MapPath("~/WJ_Attachment/"), FilePath);
            Boolean flag = false;
            if (System.IO.File.Exists(PhysicalPath))
            {
                System.IO.File.Delete(PhysicalPath);
                flag = true;
            }
            JsMessage jm = new JsMessage();
            jm.IsSuccess = flag;
            string ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }



    }
}
