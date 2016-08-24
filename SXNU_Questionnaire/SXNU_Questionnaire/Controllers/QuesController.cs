using SXNU_Questionnaire.Areas.Admin.Models;
using SXNU_Questionnaire.Common;
using SXNU_Questionnaire.Models;
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


        public ActionResult QuesFirstStep(int ID)
        {
            DataTable dt =SqlStr_Process.GetWJByID_Answer(ID);
            QuestionInfo Quest = new QuestionInfo();
            if (dt != null)
            {
                Session["V_Code"] = dt.Rows[0]["wj_Number"].ToString();
                Session.Timeout = 120;
                DateTime end = DateTime.Parse(dt.Rows[0]["wj_ValidEnd"].ToString());
                if (end > DateTime.Now )
                {
                    Quest.wj_EndBody = "n";  // 过期
                }
                else
                {
                    Quest.wj_EndBody = "y";
                }
                Quest.wj_Number = dt.Rows[0]["wj_Number"].ToString();
                Quest.wj_ID =int.Parse(dt.Rows[0]["wj_ID"].ToString());
                Quest.wj_Title = dt.Rows[0]["wj_Title"].ToString();
                Quest.wj_BeginBody = dt.Rows[0]["wj_BeginBody"].ToString().Replace(" ", "&nbsp;").Replace("\n", "<br/>");
            }
            else
            {
                return Content("问卷不存在！");
            }
            return View(Quest);
        }

        public ActionResult Validate_Code(int wjid, string code)
        {
            JsMessage jm = new JsMessage();
            DataTable dt = SqlStr_Process.GetWJByID_Answer(wjid);
            string ResultStr = string.Empty;
            if (dt != null)
            {
                if (dt.Rows.Count == 1)
                {
                    string temp = dt.Rows[0]["wj_Number"].ToString();
                    if (code == temp)
                    {
                        jm.IsSuccess = true;
                    }
                    else {
                        jm.IsSuccess = false;
                        jm.ErrorMsg = "认证码不匹配";
                    }
                }
                else {
                    jm.IsSuccess = false;
                    jm.ErrorMsg = "问卷不存在";
                }
            }
            else 
            {
                jm.IsSuccess = false;
                jm.ErrorMsg = "问卷不存在";
            }
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }


        [V_CodeFilter]
        public ActionResult QuesTwoStep(int ID)
        {
            DataTable dt = SqlStr_Process.GetWJByID_Answer(ID);
            QuestionInfo Quest = new QuestionInfo();
            if (dt != null)
            {
                Session["V_Code"] = dt.Rows[0]["wj_Number"].ToString();
                Session.Timeout = 120;
                Quest.wj_ID = int.Parse(dt.Rows[0]["wj_ID"].ToString());
                Quest.wj_Title = dt.Rows[0]["wj_Title"].ToString();
                Quest.wj_BeginBody = dt.Rows[0]["wj_BeginBody"].ToString().Replace(" ", "&nbsp;").Replace("\n", "<br/>");
            }
            else
            {
                return Content("问卷不存在！");
            }
            return View(Quest);
        }
        [V_CodeFilter]
        public ActionResult Answer(int id,int aid)
        {
            ViewBag.id = id;
            ViewBag.aid = aid;
            ViewBag.time = 0;
            DataTable dt = SqlStr_Process.GetWJByID_Answer(id);
            if (dt != null)
            {
                ViewBag.wj_Title = dt.Rows[0]["wj_Title"].ToString();
                ViewBag.time = dt.Rows[0]["wj_Time"].ToString();
            }
            else
            {
                return Content("问卷不存在！");
            }
            return View();
        }


        public ActionResult GetIndexQuestion()
        {
            string SqlStr = "SELECT TOP 6 wj_ID ,wj_Number,wj_Status,wj_Sponsor,wj_Title,wj_BeginPic,wj_ProjectSource,wj_Time,CONVERT(varchar(100),  wj_ValidStart, 23) As wj_ValidStart,CONVERT(varchar(100),  wj_ValidEnd, 23) As wj_ValidEnd , CONVERT(varchar(100),wj_PublishTime, 23) AS wj_PublishTime,wj_Status,wj_BeginBody,wj_BaseInfo FROM  [dbo].[WJ] WHERE [wj_Status]='y'  ORDER BY  wj_PublishTime  DESC";
            DataTable dt = SqlStr_Process.GetIndexData(SqlStr);
            if (dt != null)
            {
                dt.Columns.Add("IsExpire");
                DateTime NowDate = DateTime.Now;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    // CASE WHEN ([wj_ValidEnd] > GETDATE()) THEN 'n'  ELSE 'y' END AS IsExpire
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


        /// <summary>
        /// 数据库分页
        /// </summary>
        /// <param name="Q"></param>
        /// <returns></returns>
        public ActionResult GetIndexQuesData(QueryModel Q)
        {
            String ResultJson = "";
            Q.StrWhere=Q.StrWhere == null ? "" : Q.StrWhere;
            int BeginIndex = Q.CurrenPageIndex == 0 ? 0 : Q.CurrenPageIndex * Q.PageSize + 1;
            int Endindex = BeginIndex + Q.PageSize - (Q.CurrenPageIndex == 0 ? 0 : 1);
            QuesIndex QI = SqlStr_Process.GetListByPro(Q.StrWhere, "am_ID", BeginIndex, Endindex);
            int TotalRecords = QI.Total;
            int TotalPages = TotalRecords / Q.PageSize + (TotalRecords % Q.PageSize == 0 ? 0 : 1);
            ResultJson = "{\"Data\":" + JsonTool.DtToJson(QI.Data) + ", \"TotalRecords\":" + TotalRecords + ",\"TotalPages\":" + TotalPages + "}";
            return Content(ResultJson.ToString());
        }

        public ActionResult GetBaseInfoBy_WJID(int ID) 
        {
            DataTable dt = SqlStr_Process.GetWJByID_Answer(ID);
            return Content(JsonTool.DtToJson(dt));
        }

        public ActionResult InsertBaseInfo(AnswerUserInfo au)
        {
            JsMessage jm = SqlStr_Process.Add_BaseInfo(au);
            string ResultStr = string.Empty;
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }

        public ActionResult GetSTBy_WJID(int ID)
        {
            DataTable dt = SqlStr_Process.GetListByPage_Calc("[SXNU_Questionnaire].[dbo].[WT]", "wt_WJID=" + ID, 0, 9999);
            return Content(JsonTool.DtToJson(dt));
        }


        public ActionResult SaveAnswer(CommonMode CommonMode)
        {
            JsMessage jm = SqlStr_Process.Add_Answer(CommonMode);
            string ResultStr = string.Empty;
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }


        public ActionResult ViewAnswer(int auid, int wjid)
        {
            ViewBag.id = wjid;
            ViewBag.aid = auid;

            DataTable dt = SqlStr_Process.GetWJByID_Answer(wjid);
            //DataTable BaseInfo =SqlStr_Process.Get_AnswerInfo(wjid);
            if (dt != null  )
            {
                ViewBag.wj_Title = dt.Rows[0]["wj_Title"].ToString();
                //ViewBag.time = BaseInfo.Rows[0]["au_Time"].ToString();
            }
            else
            {
                return Content("问卷不存在！");
            }
            return View();
        }


        public ActionResult GetAnswerFinish(int wjid,int auid)
        {
            String ResultJson = "";
            DataTable Ansewer = SqlStr_Process.GetAnswerFinish(wjid,auid);
            DataTable BaseInfo = SqlStr_Process.Get_AnswerInfo(auid);
            ResultJson = "{\"aw\":" + JsonTool.DtToJson(Ansewer) + ", \"baseinfo\":" + BaseInfo.Rows[0]["au_AnswerUserInfo"].ToString() + ",\"time\":" + BaseInfo.Rows[0]["au_Time"].ToString() + ",\"Name\":\"" + BaseInfo.Rows[0]["au_Name"].ToString().Trim() + "\"}";
            return Content(ResultJson.ToString());
        }

    }
}
