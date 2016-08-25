using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.IO;
using System.Text;
using NPOI;
using NPOI.HPSF;
using NPOI.HSSF;
using NPOI.HSSF.UserModel;
using NPOI.HSSF.Util;
using NPOI.POIFS;
using NPOI.Util;
using NPOI.SS.UserModel;
using System.Text.RegularExpressions;
using NPOI.SS.Util;
using System.Collections.Generic;

namespace SXNU_Questionnaire.Common
{


    public class Auswer_Filed
    {
        //public string ck { get; set; }
        public string tit { get; set; }
        //public string ty { get; set; }
        //public string val { get; set; }
        public string iv { get; set; }
    }

    #region============== 答案json 对象 


    public class dx 
    {
        public string an { get; set; }
        public string ov { get; set; }
    }

    #endregion





    public class Export_Excle
    {


        public static int WT_Total;

        public static List<WT_Model> ProcessDataOrder(int wjid)
        {
            List<WT_Model> WtList = new List<WT_Model>();

            DataTableCollection dcs = SqlStr_Process.GetWTByWJID_Word(wjid);
            DataTable WT = dcs[0];
            DataTable SubWT = dcs[1];
            WT_Total = WT.Rows.Count + SubWT.Rows.Count;
            for (int i = 0; i < WT.Rows.Count; i++)
            {
                WT_Model temp = new WT_Model();
                temp.wt_ID = int.Parse(WT.Rows[i]["wt_ID"].ToString());
                temp.wt_PID = int.Parse(WT.Rows[i]["wt_PID"].ToString());
                temp.wt_Type = WT.Rows[i]["wt_Type"].ToString();
                temp.wt_OrderNum = (i + 1).ToString();
                if (temp.wt_Type == "4")
                {
                    int num = 1;
                    List<WT_Model> Sublist_t = new List<WT_Model>();
                    for (int b = 0; b < SubWT.Rows.Count; b++)
                    {
                        if (temp.wt_ID == int.Parse(SubWT.Rows[b]["wt_PID"].ToString()))
                        {
                            WT_Model subwt = new WT_Model();
                            subwt.wt_ID = int.Parse(SubWT.Rows[b]["wt_ID"].ToString());
                            subwt.wt_PID = int.Parse(SubWT.Rows[b]["wt_PID"].ToString());
                            //subwt.wt_Title = SubWT.Rows[b]["wt_Title"].ToString();
                            //subwt.wt_Problem = SubWT.Rows[b]["wt_Problem"].ToString();
                            //subwt.wt_Options = SubWT.Rows[b]["wt_Options"].ToString();
                            subwt.wt_Type = SubWT.Rows[b]["wt_Type"].ToString();
                            //subwt.wt_LimitTime = int.Parse(SubWT.Rows[b]["wt_LimitTime"].ToString());
                            subwt.wt_OrderNum = temp.wt_OrderNum + "." + num;
                            Sublist_t.Add(subwt);
                            num++;
                        }
                    }
                    num = 1;
                    temp.Sublist = Sublist_t;
                }
                WtList.Add(temp);
            }
            return WtList;
        }


        /// <summary>
        /// Datatable导出Excel
        /// </summary>
        /// <param name="SourceTable"></param>
        /// <returns></returns>
        public static Stream RenderDataTableToExcel(int wjid, string wjTitle)
        {
            List<WT_Model> WtList = Export_Excle.ProcessDataOrder(wjid);
            DataTable AnserInfo_all = SqlStr_Process.Get_AnswerInfoByWJID(wjid);

            HSSFWorkbook workbook = new HSSFWorkbook();
            MemoryStream ms = new MemoryStream();
            ISheet sheet = workbook.CreateSheet();
            sheet.SetColumnWidth(0, 50 * 256);

            #region 表头及样式

          



            IRow headerRow1 = sheet.CreateRow(0);
            headerRow1.HeightInPoints = 25;
            headerRow1.CreateCell(0).SetCellValue(wjTitle);

            ICellStyle headStyle1 = workbook.CreateCellStyle();
            headStyle1.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            //headStyle1.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            //headStyle1.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
            //headStyle1.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
            //headStyle1.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            IFont font1 = workbook.CreateFont();
            font1.FontHeight = 18;
            font1.Color = 125;
            font1.FontHeightInPoints = 20;
            font1.Boldweight = 700;

            headStyle1.SetFont(font1);
            headerRow1.GetCell(0).CellStyle = headStyle1;
            sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, WtList.Count - 1));



            ICellStyle headStyle2 = workbook.CreateCellStyle();
            headStyle2.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            //headStyle2.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            //headStyle2.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
            //headStyle2.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
            //headStyle2.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            IFont font2 = workbook.CreateFont();
            font2.FontHeight = 12;
            font2.Color = (short)FontColor.Normal;
            font2.FontHeightInPoints = 13;
            font2.Boldweight = 500;
            headStyle2.SetFont(font2);


            ICellStyle Row0_C0 = workbook.CreateCellStyle();
            Row0_C0.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            Row0_C0.VerticalAlignment = VerticalAlignment.Center;
            //Row0_C0.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            //Row0_C0.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
            //Row0_C0.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
            //Row0_C0.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            IFont rc_font = workbook.CreateFont();
            rc_font.FontHeight = 12;
            //rc_font.Color = (short)FontColor.Normal;
            rc_font.FontHeightInPoints = 13;
            rc_font.Boldweight = 600;
            Row0_C0.SetFont(font2);




            ICellStyle Row_list = workbook.CreateCellStyle();
            Row_list.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            Row_list.VerticalAlignment = VerticalAlignment.Center;
            //Row_list.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            //Row_list.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
            //Row_list.BorderRight = NPOI.SS.UserModel.BorderStyle.Thin;
            //Row_list.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
           



            IRow ParentNum = sheet.CreateRow(1);
            ParentNum.HeightInPoints = 20;

            IRow SubNum = sheet.CreateRow(2);
            SubNum.HeightInPoints = 20;


            ParentNum.CreateCell(0).SetCellValue("填表人 / 题号");
            SubNum.CreateCell(0).SetCellValue("");
            int num_p = 0;
            for (int p = 0; p < WtList.Count; p++)
            {
                if (WtList[p].wt_Type != "4")
                {
                    num_p++;
                    ParentNum.CreateCell(num_p).SetCellValue(WtList[p].wt_OrderNum.ToString());
                    SubNum.CreateCell(num_p).SetCellValue("");
                    ParentNum.GetCell(num_p).CellStyle = headStyle2;
                    SubNum.GetCell(num_p).CellStyle = headStyle2;
                    sheet.AddMergedRegion(new CellRangeAddress(1, 2, num_p, num_p));
                }
                else
                {
                    for (int s = 0; s < WtList[p].Sublist.Count; s++)
                    {
                        num_p++;
                        ParentNum.CreateCell(num_p).SetCellValue(WtList[p].wt_OrderNum.ToString());
                        SubNum.CreateCell(num_p).SetCellValue(WtList[p].Sublist[s].wt_OrderNum.ToString());
                        ParentNum.GetCell(num_p).CellStyle = headStyle2;
                        SubNum.GetCell(num_p).CellStyle = headStyle2;
                    }
                    sheet.AddMergedRegion(new CellRangeAddress(1, 1, (num_p - WtList[p].Sublist.Count + 1), num_p));
                }
            }
            sheet.AddMergedRegion(new CellRangeAddress(1, 2, 0, 0));
            ParentNum.GetCell(0).CellStyle = Row0_C0;
            #endregion


            #region ======== 添加答题答案=====

            // AnserInfo_all
            if (AnserInfo_all != null)
            {
                string u_info = "";
                for (int x = 0; x < AnserInfo_all.Rows.Count; x++)
                {
                    IRow Answer_row = sheet.CreateRow(x + 3);
                    List<Auswer_Filed> Item_list = JsonTool.JSONStringToList<Auswer_Filed>(AnserInfo_all.Rows[x]["au_AnswerUserInfo"].ToString());
                    u_info =AnserInfo_all.Rows[x]["au_Name"].ToString() + "\n";
                    foreach (Auswer_Filed af in Item_list)
                    {
                        u_info += af.tit + ":" + af.iv + "\n";
                    }
                    Answer_row.CreateCell(0).SetCellValue(u_info);
                    //Answer_row.GetCell(0).CellStyle = Row_list;
                    int AU_ID = int.Parse(AnserInfo_all.Rows[x]["au_ID"].ToString());
                    DataTable a_list = SqlStr_Process.GetAnswer_Excel(wjid,AU_ID); // 开始处理数据

                    for (int y = 1; y < a_list.Rows.Count + 1; y++)
                    {
                        string type=a_list.Rows[y-1]["an_wtType"].ToString();
                        string an_leapfrog=a_list.Rows[y-1]["an_leapfrog"].ToString();
                        string an_Invalid=a_list.Rows[y-1]["an_Invalid"].ToString();
                        string value = "";
                        string Answer_Json = a_list.Rows[y - 1]["an_Result"].ToString() == "" ? "[]" : a_list.Rows[y - 1]["an_Result"].ToString();
                        if (an_leapfrog != "y" || an_Invalid != "y")
                        {
                            switch (type)
                            {
                                case "1":
                                    dx Answer_dx = (dx)JsonTool.ConvertToList(Answer_Json, new dx().GetType());
                                    if (Answer_dx.ov != "")
                                    {
                                        value = Answer_dx.an + "," + Answer_dx.ov;
                                    }
                                    else 
                                    {
                                        value = Answer_dx.an;
                                    }
                                    break;
                                case "2":
                                    List<dx> Answer_dux = JsonTool.JSONStringToList<dx>(Answer_Json);
                                    foreach (dx d in Answer_dux)
                                    {
                                        if (d.ov == "")
                                        {
                                            value += d.an + ",";
                                        }
                                        else 
                                        {
                                            value += d.an+",";
                                        }
                                    }
                                    if (value.Length > 1)
                                    {
                                        value.Substring(0, value.Length - 1);
                                    }
                                    break;
                                case "3":
                                    List<string> Answer_wd = JsonTool.JSONStringToList<string>(Answer_Json);
                                    foreach (string d in Answer_wd)
                                    {
                                        value += d + ",";
                                    }
                                    if (Answer_wd.Count > 1) 
                                    {
                                        value = Answer_wd.Count+" ;"+value;
                                    }
                                    if (value.Length > 1)
                                    {
                                        value.Substring(0, value.Length - 1);
                                    }
                                   
                                    break;
                                //case "4":
                                     
                                //    break;
                                case "5":
                                    List<string> Answer_bg = JsonTool.JSONStringToList<string>(Answer_Json);
                                    foreach (string  d in Answer_bg)
                                    {
                                        value += d + ";";
                                    }
                                    //value.Substring(0, value.Length - 1);
                                    break;
                            }
                        }
                        Answer_row.CreateCell(y).SetCellValue(value);
                        //Answer_row.GetCell(y).CellStyle = Row_list;
                    }
                }
            }


            #endregion







            workbook.Write(ms);
            ms.Flush();
            ms.Position = 0;

            sheet = null;
            headerRow1 = null;
            workbook = null;
            headStyle2 = null;
            Row0_C0 = null;
            return ms;
        }

        public static bool isNumeric(String message, out double result)
        {
            Regex rex = new Regex(@"^[-]?\d+[.]?\d*$");
            result = -1;
            if (rex.IsMatch(message))
            {
                result = double.Parse(message);
                return true;
            }
            else
                return false;

        }

    }
}