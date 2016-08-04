using SXNU_Questionnaire.Common;
using SXNU_Questionnaire.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SXNU_Questionnaire.Controllers
{
    public class TestController : Controller
    {
        //
        // GET: /Test/

        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Default()
        {
            return View();
        }

        public ActionResult AddData()
        {
            return View();
        }
        //public ActionResult AddData_DB(UserInfo ui)
        //{
        //    string Vcode = "";
        //    if (Session["vcode"] != null) 
        //    {
        //        Vcode = Session["vcode"].ToString();
        //    }
        //    string ResultStr = string.Empty;
        //    JsMessage jm = SqlStr_Process.Add_Userinfo(ui);

             

        //    ResultStr = JsonTool.ObjToJson(jm);
        //    return Content(ResultStr);
        //}


        public ActionResult ExportWord()
        {

            return View();
        }
        #region ===========下载文件==========
        public FileStreamResult DownFile1(string filePath, string fileName)
        { 
            string absoluFilePath = Server.MapPath(@"~\UploadFiles\g1.gif");
            string temppath = Server.MapPath(@"~\Generate\question.doc");
            string savepath = Server.MapPath(@"~\Generate\");
            string FileName = DateTime.Now.ToString("yyyyMMddhhmmss") + ".doc";
            savepath = savepath + FileName;
            
           
            //return File(new FileStream(absoluFilePath, FileMode.Open), "application/octet-stream", Server.UrlEncode("sss.gif"));
            Question_Export qe = new Question_Export();
            qe.Generate("",temppath, savepath);
            return null;
        }
        public ActionResult Down_ZIP_File() 
        {

           
            string Question_Name = "问卷名称.zip";
            string ZipSpurcePath = Server.MapPath(@"~\Generate\20160531100907-xqx\");
            string SaveZip = Server.MapPath(@"~\Generate\temp.zip");
            ComproessionFiles com = new ComproessionFiles();
            com.CompressFiles(ZipSpurcePath, SaveZip);
            FileStream fs = new FileStream(SaveZip, FileMode.Open);
            byte[] bytes = new byte[(int)fs.Length];
            fs.Read(bytes, 0, bytes.Length);
            fs.Close();
            Response.Charset = "UTF-8";
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("UTF-8");
            Response.ContentType = "application/octet-stream";

            Response.AddHeader("Content-Disposition", "attachment; filename=" + Server.UrlEncode(Question_Name));
            Response.BinaryWrite(bytes);
            Response.Flush();
            Response.End();
            return new EmptyResult();
        }
        public ActionResult Down_Excle() 
        {
            string Save_Path = Server.MapPath(@"~\Generate\Answer.xls");
            DataTable dt = SqlStr_Process.GetListByPage("[Test].[dbo].[user_info]", "", "id", 1000, 2000);
            Stream fs = Export_Excle.RenderDataTableToExcel(dt);
            byte[] bytes = new byte[(int)fs.Length];
            fs.Read(bytes, 0, bytes.Length);
            fs.Close();
            Response.Charset = "UTF-8";
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("UTF-8");
            Response.ContentType = "application/octet-stream";

            Response.AddHeader("Content-Disposition", "attachment; filename=" + Server.UrlEncode("Answer.xls"));
            Response.BinaryWrite(bytes);
            Response.Flush();
            Response.End(); 
            return new EmptyResult();
        }



        public ActionResult DownFile(string filePath, string fileName)
        {
            string FileName = DateTime.Now.ToString("yyyyMMddhhmmss") + ".doc";
            string Questiong_Name = @"" + DateTime.Now.ToString("yyyyMMddhhmmss") + @"-xqx\";
            string temppath = Server.MapPath(@"~\Generate\question.doc");
            string savepath = Server.MapPath(@"~\Generate\"); 
            string BasePath = Server.MapPath(@"~");
            savepath = savepath + Questiong_Name;
            if (!Directory.Exists(savepath))
            {
                Directory.CreateDirectory(savepath);
            }
            savepath = savepath + FileName;
            Question_Export qe = new Question_Export();
            qe.Generate(BasePath, temppath, savepath);
            FileStream fs = new FileStream(savepath, FileMode.Open);
            byte[] bytes = new byte[(int)fs.Length];
            fs.Read(bytes, 0, bytes.Length);
            fs.Close();
            Response.Charset = "UTF-8";
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("UTF-8");
            Response.ContentType = "application/octet-stream";

            Response.AddHeader("Content-Disposition", "attachment; filename=" + Server.UrlEncode(FileName));
            Response.BinaryWrite(bytes);
            Response.Flush();
            Response.End();
            if (System.IO.File.Exists(savepath))//判断文件是否存在
            {
                System.IO.File.Delete(savepath);//执行IO文件删除  
            }
            return new EmptyResult();

        }
        #endregion
        public ActionResult ShowData()
        {
            return View();
        }

        public ActionResult GetUserInfos(QueryModel Q)
        {
            //String ResultJson = "" ;
            //int BeginIndex = Q.CurrenPageIndex == 0 ? 0 : Q.CurrenPageIndex * Q.PageSize + 1;
            //int Endindex = BeginIndex + Q.PageSize - (Q.CurrenPageIndex == 0 ? 0 : 1);
            //DataTable dt =SqlStr_Process.GetListByPage("[Test].[dbo].[user_info]", "", "id", BeginIndex, Endindex);
            //int TotalRecords = SqlStr_Process.GetTotalRecord("[dbo].[user_info]", "");
            //int TotalPages =  TotalRecords / Q.PageSize + ( TotalRecords % Q.PageSize == 0 ? 0 : 1);
            //ResultJson = "{\"Data\":" + JsonTool.DtToJson(dt) + ", \"TotalRecords\":" + TotalRecords + ",\"TotalPages\":" + TotalPages + "}";
            //return Content(ResultJson.ToString());
            String ResultJson = "";
            int BeginIndex = Q.CurrenPageIndex == 1 ? 1 : Q.CurrenPageIndex * Q.PageSize;
            int Endindex = BeginIndex + Q.PageSize - (Q.CurrenPageIndex == 1 ? 1 : 0);
            DataTable dt = SqlStr_Process.GetListByPage("[Test].[dbo].[user_info]", "", "id", BeginIndex, Endindex);
            int TotalRecords = SqlStr_Process.GetTotalRecord("[dbo].[user_info]", "");
            int TotalPages = TotalRecords / Q.PageSize + (TotalRecords % Q.PageSize == 0 ? 0 : 1);
            ResultJson = "{\"Data\":" + JsonTool.DtToJson(dt) + ", \"TotalRecords\":" + TotalRecords + ",\"TotalPages\":" + TotalPages + "}";
            return Content(ResultJson.ToString());
        }


        public ActionResult Countdown()
        {
            return View();
        }


        //public ActionResult GetUserInfo()
        //{
        //    string ResultStr = string.Empty;
        //    UserInfo u = new UserInfo();
        //    u.name = "andy";
        //    u.age = 12;
        //    u.address = "xxxxx-12-111xxx";
        //    u.birthday = "2015-12-12";
        //    u.mark = "biezhu ";
        //    u.modify = DateTime.Now.ToShortDateString();
        //    ResultStr = JsonTool.ObjToJson(u);
        //    return Content(ResultStr);

        //}


        public ActionResult Yzm() 
        {
            YZMHelper yzm = new YZMHelper();
            yzm.CreateImage();
            Session["vcode"] = yzm.Text.ToLower();  //Session中保存验证码 
            MemoryStream ms = new MemoryStream();
            yzm.Image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
            return File(ms.ToArray(), @"image/jpeg");  
        }


        public ActionResult DeleteUser(int ID)
        {
            string ResultStr = string.Empty;
            JsMessage jm = SqlStr_Process.DeleteUser(ID);
            ResultStr = JsonTool.ObjToJson(jm);
            return Content(ResultStr);
        }



        public ActionResult MultiUpload(IEnumerable<HttpPostedFileBase> filename)
        {
            foreach (var file in filename)
            {
                if (file != null && file.ContentLength > 0)
                {
                    string timeStr = DateTime.Now.ToString("yyyyMMddhhmmss") + DateTime.Now.Millisecond.ToString();
                    string FileType = Path.GetExtension(file.FileName);
                    string NewFileName = timeStr + FileType;
                    string fileName = Path.Combine(Request.MapPath("~/UploadFiles/Images"), NewFileName);
                    try
                    {
                        file.SaveAs(fileName);
                    }
                    catch
                    {
                        return Content("上传异常 ！", "text/plain");
                    }
                }
            }
            return RedirectToAction("Index", "Home");
        }

        public ActionResult FileUpload()
        {

            if (Request.Files.Count > 0)
            {
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    if (Request.Files[i].ContentLength > 0)
                    {
                        //ImageStore imageStore = new ImageStore();
                        //imageStore.Name = Path.GetFileName(file.FileName);
                        //imageStore.MimeType = file.ContentType;
                        //using (Stream inputStream = file.InputStream)
                        //{
                        //    MemoryStream memoryStream = inputStream as MemoryStream;
                        //    if (memoryStream == null)
                        //    {
                        //        memoryStream = new MemoryStream();
                        //        inputStream.CopyTo(memoryStream);

                        //    }
                        //    imageStore.Content = memoryStream.ToArray();
                        //}
                        var file = Request.Files[i];
                        string timeStr = DateTime.Now.ToString("yyyyMMddhhmmss") + DateTime.Now.Millisecond.ToString();
                        string FileType = Path.GetExtension(file.FileName);
                        string NewFileName = timeStr + FileType;
                        string fileName = Path.Combine(Request.MapPath("~/UploadFiles/Images"), NewFileName);
                        try
                        {
                            file.SaveAs(fileName);
                        }
                        catch
                        {
                            return Content("上传异常 ！", "text/plain");
                        }


                    }
                }
            }
            return RedirectToAction("Index", "Home");
        }

    }
}
