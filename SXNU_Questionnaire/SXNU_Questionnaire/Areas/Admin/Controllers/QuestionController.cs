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


        public ActionResult Subst(int wjID, int ID)
        {

            ViewBag.WJ_ID = wjID;
            ViewBag.ParentSJ_ID = ID;
            return View();
        }

        public ActionResult QuesList()
        {
            return View();
        }
        public ActionResult QuesListByPage(QueryModel Q) 
        {
            String ResultJson = "";
            string StrWhere = "";
            if (!string.IsNullOrEmpty(Q.StrWhere))
            {
                //StrWhere = "am_LoginUser　like '%" + Q.StrWhere + "%' or am_Email like '%" + Q.StrWhere + "%'";
                StrWhere = "wj_Title　like '%" + Q.StrWhere + "%'";
            }
            int BeginIndex = Q.CurrenPageIndex == 0 ? 0 : Q.CurrenPageIndex * Q.PageSize + 1;
            int Endindex = BeginIndex + Q.PageSize - (Q.CurrenPageIndex == 0 ? 0 : 1);
            DataTable dt = SqlStr_Process.GetListByPage("[SXNU_Questionnaire].[dbo].[WJ]", StrWhere, "wj_ID", BeginIndex, Endindex);
            int TotalRecords = SqlStr_Process.GetTotalRecord("[SXNU_Questionnaire].[dbo].[WJ]", StrWhere);
            int TotalPages = TotalRecords / Q.PageSize + (TotalRecords % Q.PageSize == 0 ? 0 : 1);
            ResultJson = "{\"Data\":" + JsonTool.DtToJson(dt) + ", \"TotalRecords\":" + TotalRecords + ",\"TotalPages\":" + TotalPages + "}";
            return Content(ResultJson.ToString());
        }
        public ActionResult Step1(int ID)
        {
            ViewBag.WJ_ID = ID;
            return View();
        }

        public ActionResult Modst(int sjid,int wjid) 
        {
            ViewBag.SJ_ID = sjid;
            ViewBag.WJ_ID = wjid;
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
            wj.wj_ID = int.Parse(Request.Form["WJ_nID"]);
            wj.wj_Number = SXNU_Questionnaire.Common.Rand.Str(13, true);
            wj.wj_Title = Request.Form["wj_Title"];
            wj.wj_ProjectSource = Request.Form["wj_ProjectSource"];
            wj.wj_Time = Request.Form["wj_Time"];
            wj.wj_ValidStart = Request.Form["wj_ValidStart"];
            wj.wj_ValidEnd = Request.Form["wj_ValidEnd"];
            wj.wj_BeginBody = Request.Form["wj_BeginBody"];
            wj.wj_BeginPic = Request.Form["WJ_nfm"];
            
           
            if (Request.Files.Count > 0)
            {
                if (Request.Files[0].ContentLength > 0)
                {
                    wj.wj_BeginPic = "fc";
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



        /// <summary>
        /// 根据问卷id 获取试题
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>

        public ActionResult GetSTBy_WJID(int ID) 
        {
            DataTable dt = SqlStr_Process.GetListByPage_Calc("[SXNU_Questionnaire].[dbo].[WT]", "wt_WJID=" + ID, 0, 9999);
            return Content(JsonTool.DtToJson(dt));
        }

        /// <summary>
        /// 根据试题id 获取试题
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public ActionResult GetSTBy_STID(int ID)
        {
            DataTable dt = SqlStr_Process.GetListByPage("[SXNU_Questionnaire].[dbo].[WT]", "wt_ID=" + ID, "wt_ID", 0, 2);
            return Content(JsonTool.DtToJson(dt));
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



        #region =========== 保存试题=============  
        /// <summary>
        /// 保存单选题  多选
        /// </summary>
        /// <returns></returns>
        public ActionResult Delete_SJ(int ID)
        {
            JsMessage jm = new JsMessage();
            string ResultStr = string.Empty;
            jm = Sql_STManage.Delete_SJ(ID);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }

        /// <summary>
        /// 修改试题
        /// </summary>
        /// <returns></returns>
        public ActionResult Modeify_ST(DanXuan dx)
        {
            dx.wt_LogicRelated = "";
            dx.wt_Problem = dx.wt_Problem == null ? "" : dx.wt_Problem;
            dx.wt_Options = dx.wt_Options == null ? "" : dx.wt_Options;
            JsMessage jm = new JsMessage();
            string ResultStr = string.Empty;
            jm = Sql_STManage.Modify_ST(dx);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }

        
        /// <summary>
        /// 保存试题
        /// </summary>
        /// <returns></returns>
        public ActionResult Save_ST(DanXuan dx)
        {
            dx.wt_LogicRelated = "";
            dx.wt_Problem = dx.wt_Problem == null ? "" : dx.wt_Problem;
            JsMessage jm = new JsMessage();
            string ResultStr = string.Empty;
            jm = Sql_STManage.Add_DXST(dx);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }
        /// <summary>
        /// 保存 组合题返回试题自增ID
        /// </summary>
        /// <returns></returns>
        public ActionResult Save_ZHST(DanXuan dx)
        {
            dx.wt_LogicRelated = "";
            dx.wt_Problem = dx.wt_Problem == null ? "" : dx.wt_Problem;
            dx.wt_Options = dx.wt_Options == null ? "" : dx.wt_Options;
            JsMessage jm = new JsMessage();
            string ResultStr = string.Empty;
            jm = Sql_STManage.Add_ZHST(dx);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        } 
        #endregion




    }
}
                                                                                                                                                                                                       