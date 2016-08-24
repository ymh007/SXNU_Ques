using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Aspose.Words;
using System.Data;
using Aspose.Words.Fields;
using SXNU_Questionnaire.Areas.Admin.Models;
namespace SXNU_Questionnaire.Common
{
    public class Question_Export
    {


        public Path_Model pm { get; set; }
        public Question_Export(Path_Model pm)
        {
            this.pm = pm;
        }

        private void InsertControles(DocumentBuilder builder, WT_Model wt_Model)
        {

            string type = wt_Model.wt_Type;
            string pic_list = "";
            builder.InsertHtml("<b>" + wt_Model.wt_OrderNum + ". " + wt_Model.wt_Title + "</b>");
            if (wt_Model.wt_Problem.Trim() != "")
            {
                List<Pic_Vido> pvlist = JsonTool.JSONStringToList<Pic_Vido>(wt_Model.wt_Problem);
                builder.InsertHtml("<br />");
                foreach (Pic_Vido pv in pvlist)
                {
                    if (pv.t == "p")
                    {
                        //if (System.IO.File.Exists(pm.BasePath + pv.n))
                        //{ builder.InsertImage(pm.BasePath + pv.n, 50, 50); builder.Write(""); }
                        //else { builder.InsertImage(pm.defaultPic, 50, 50); builder.Write(""); }
                        pic_list += "<img align='left' width='100' height='100' src='" + pm.BasePath + pv.n + "'></img> &nbsp;&nbsp;";
                    }
                    else
                    {
                        //builder.InsertHtml(" <a href='" + pm.BasePath + pv.n + "'>视频</a>");
                        pic_list += " <a href='" + pm.BasePath + pv.n + "'>视频</a>";
                    }
                }
            }
            builder.InsertHtml(pic_list);
            switch (type)
            {
                case "1":

                    try
                    {
                        List<Item_Model> Item_list = JsonTool.JSONStringToList<Item_Model>(wt_Model.wt_Options);
                        string item_list = "";
                        foreach (Item_Model item in Item_list)
                        {
                            item_list += "<div align='left'> 〇 " + item.t + "</div>";
                            if (item.pv.Count != 0)
                            {
                                foreach (Pic_Vido pv in item.pv)
                                {
                                    if (pv.t == "p")
                                    {
                                        item_list += "<img align='left' width='100' height='100' src='" + pm.BasePath + pv.n + "'></img> &nbsp;&nbsp;";
                                    }
                                    else
                                    {
                                        item_list += " <a href='" + pm.BasePath + pv.n + "'>视频</a>";
                                    }
                                }
                            }

                        }
                        //item_list  +="<br />";
                        builder.InsertHtml(item_list);
                        builder.InsertBreak(BreakType.LineBreak);
                    }
                    catch (Exception ex)
                    {
                        System.IO.File.AppendAllText(pm.logPath, DateTime.Now.ToString() + "=================error==============\r\n" + ex.ToString());
                    }
                    break;
                case "2":
                    //□
                    try
                    {
                        List<Item_Model> Item_list = JsonTool.JSONStringToList<Item_Model>(wt_Model.wt_Options);
                        string item_list = "";
                        foreach (Item_Model item in Item_list)
                        {
                            item_list += "<div align='left'> □ " + item.t + "</div>";
                            if (item.pv.Count != 0)
                            {
                                foreach (Pic_Vido pv in item.pv)
                                {
                                    if (pv.t == "p")
                                    {
                                        item_list += "<img align='left' width='100' height='100' src='" + pm.BasePath + pv.n + "'></img> &nbsp;&nbsp;";
                                    }
                                    else
                                    {
                                        item_list += " <a href='" + pm.BasePath + pv.n + "'>视频</a>";
                                    }
                                }
                            }

                        }
                        builder.InsertHtml(item_list);
                        builder.InsertBreak(BreakType.LineBreak);
                    }
                    catch (Exception ex)
                    {
                        System.IO.File.AppendAllText(pm.logPath, DateTime.Now.ToString() + "=================error==============\r\n" + ex.ToString());
                    }
                    break;
                case "3":
                    WD_Model wd_m = (WD_Model)JsonTool.ConvertToList(wt_Model.wt_Options, new WD_Model().GetType());
                    if (wd_m != null)
                    {
                        if (wd_m.c == "1")
                        {
                            Aspose.Words.Tables.Table table = builder.StartTable();
                            builder.InsertCell();// 添加一个单元格                    
                            builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                            builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                            builder.CellFormat.Shading.BackgroundPatternColor = System.Drawing.Color.FromArgb(255, 255, 255);
                            //builder.CellFormat.Width = Width;
                            builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                            builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//水平居中对齐
                            builder.Write("");

                            //this.InserCell_All(builder, "✚");
                            //this.InserCell_All(builder, "─");
                            builder.EndRow();
                            builder.InsertCell();// 添加一个单元格                    
                            builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                            builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                            builder.CellFormat.Shading.BackgroundPatternColor = System.Drawing.Color.FromArgb(255, 255, 255);
                            //builder.CellFormat.Width = Width;
                            builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                            builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//水平居中对齐
                            builder.Write("");
                            //this.InserCell_All(builder, "✚");
                            //this.InserCell_All(builder, "─");
                            builder.EndRow();
                            builder.EndTable();
                        }
                        if (wd_m.c == "0" && wd_m.o == "1")
                        {
                            //string bg_str = "<table border='1'><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr></table>";
                            //builder.InsertHtml(bg_str);
                            Aspose.Words.Tables.Table table = builder.StartTable();
                            builder.InsertCell();// 添加一个单元格                    
                            builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                            builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                            builder.CellFormat.Shading.BackgroundPatternColor = System.Drawing.Color.FromArgb(255, 255, 255);
                            //builder.CellFormat.Width = Width;
                            builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.Previous;
                            builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//水平居中对齐
                            builder.Write("");
                            builder.EndRow();
                            builder.InsertCell();// 添加一个单元格                    
                            builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                            builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                            builder.CellFormat.Shading.BackgroundPatternColor = System.Drawing.Color.FromArgb(255, 255, 255);
                            //builder.CellFormat.Width = Width;
                            builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.Previous;
                            builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//水平居中对齐
                            builder.Write(" ");
                            builder.EndRow();
                            builder.InsertCell();// 添加一个单元格                    
                            builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                            builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                            builder.CellFormat.Shading.BackgroundPatternColor = System.Drawing.Color.FromArgb(255, 255, 255);
                            //builder.CellFormat.Width = Width;
                            builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.Previous;
                            builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//水平居中对齐
                            builder.Write("");
                            builder.EndRow();
                            builder.EndTable();
                        }
                    }
                    builder.InsertBreak(BreakType.LineBreak);
                    break;
                case "4":
                    builder.InsertHtml("<div align='left'> " + wt_Model.wt_Options + "</div>");
                    builder.InsertBreak(BreakType.LineBreak);
                    break;
                case "5":
                    BG_Model bg_m = (BG_Model)JsonTool.ConvertToList(wt_Model.wt_Options, new BG_Model().GetType());
                    //string bg_str = "<table border='1' border-style='solid' > <tr align='left'  ><td >内容项</td> ";
                    //for (int j = 0; j < bg_m.a.Count; j++)
                    //{
                    //    bg_str += " <td >" + bg_m.a[j].t + "</td>";
                    //}
                    //bg_str += " </tr>";
                    //for (int i = 0; i < bg_m.t.Count; i++)
                    //{
                    //    bg_str += "<tr align='left'>";
                    //    bg_str += "<td > " + bg_m.t[i] + "</td>";
                    //    for (int j = 0; j < bg_m.a.Count; j++)
                    //    {
                    //        bg_str += "<td > 〇 </td>";
                    //    }
                    //    bg_str += " </tr>";

                    //}

                    //bg_str += "</table>";
                    //builder.InsertHtml(bg_str);

                    if (bg_m != null)
                    {
                        Aspose.Words.Tables.Table table = builder.StartTable();
                        this.InserCell_All(builder, "内容项");
                        for (int j = 0; j < bg_m.a.Count; j++)
                        {
                            this.InserCell_All(builder, bg_m.a[j].t);
                        }
                        builder.EndRow();
                        for (int i = 0; i < bg_m.t.Count; i++)
                        {
                            this.InserCell_All(builder, bg_m.t[i]);
                            for (int j = 0; j < bg_m.a.Count; j++)
                            {
                                this.InserCell_All(builder, " 〇 ");
                            }
                            builder.EndRow();
                        }
                    }
                    builder.EndTable();
                    builder.InsertBreak(BreakType.LineBreak);
                    break;

            }
        }

        public void InserCell_All(DocumentBuilder builder, string value)
        {
            builder.InsertCell();// 添加一个单元格                    
            builder.CellFormat.Borders.LineStyle = LineStyle.Single;
            builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
            builder.CellFormat.Shading.BackgroundPatternColor = System.Drawing.Color.FromArgb(255, 255, 255);
            //builder.CellFormat.Width = 120;
            builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
            builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;//水平居中对齐
            builder.Write(value);
        }
        //public void InserCell_All(DocumentBuilder builder, string value)
        //{
        //    builder.InsertCell();// 添加一个单元格                    
        //    builder.CellFormat.Borders.LineStyle = LineStyle.Single;
        //    builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
        //    builder.CellFormat.Shading.BackgroundPatternColor = System.Drawing.Color.FromArgb(255, 255, 255);
        //    //builder.CellFormat.Width = Width;
        //    builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
        //    builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//水平居中对齐
        //    builder.Write(value);
        //}
        public void Generate(int wjid, string wj_title, string body)
        {
            // content
            // title

            List<WT_Model> WT_List = ProcessData(wjid);
            DataTable wj = SqlStr_Process.GetWJByID_Answer(wjid);
            string wj_Title = wj.Rows[0]["wj_Title"].ToString();
            Document doc = new Document(pm.temppath);
            //建立DocumentBuilder物件 
            DocumentBuilder builder = new DocumentBuilder(doc);
            #region 页面设置，设置页面为横向布局，设置纸张类型为A4纸或通过页面的宽度设置
            //设置纸张布局
            builder.PageSetup.PaperSize = PaperSize.A4;
            //builder.PageSetup.PaperSize = PaperSize.A4;
            //builder.PageSetup.Orientation = Aspose.Words.Orientation.Landscape;
            #endregion

            #region 设置word全局的字体样式和字体大小
            //builder.RowFormat.Borders.LineStyle = LineStyle.Thick;
            //builder.RowFormat.HeightRule = HeightRule.Auto;

            builder.ParagraphFormat.KeepTogether = false;
            //builder.Font.Name = "仿宋-GB2312";
            //builder.Font.Name = "宋体";
            //builder.Font.Size = 10.5; //五号




            #endregion

            #region============设置问卷标题===========
            ParagraphFormat paragraphFormat = builder.ParagraphFormat;
            paragraphFormat.Alignment = ParagraphAlignment.Center;
            //paragraphFormat.Style.Font.Size = 15;
            //paragraphFormat.Style.Font.Bold = true;
            builder.Writeln();
            builder.InsertHtml("<h1 align='center'> " + wj_title + " </h1>");
            builder.Writeln();
            builder.InsertParagraph();
            builder.PageSetup.ClearFormatting();
            builder.InsertBreak(BreakType.LineBreak);
            builder.InsertBreak(BreakType.LineBreak);
            builder.InsertBreak(BreakType.LineBreak);
            builder.InsertBreak(BreakType.LineBreak);
            builder.InsertHtml("<p>" + body + "</p>");
            #endregion
            builder.InsertBreak(BreakType.PageBreak);
            foreach (WT_Model P_wt in WT_List)
            {
                InsertControles(builder, P_wt);
                if (P_wt.wt_Type == "4")
                {
                    foreach (WT_Model wt in P_wt.Sublist)
                    {
                        InsertControles(builder, wt);
                    }

                }
            }
            doc.Save(pm.savepath);

        }

        public List<WT_Model> ProcessData(int wjid)
        {
            List<WT_Model> WtList = new List<WT_Model>();

            DataTableCollection dcs = SqlStr_Process.GetWTByWJID_Word(wjid);
            DataTable WT = dcs[0];
            DataTable SubWT = dcs[1];
            for (int i = 0; i < WT.Rows.Count; i++)
            {
                WT_Model temp = new WT_Model();
                temp.wt_ID = int.Parse(WT.Rows[i]["wt_ID"].ToString());
                temp.wt_PID = int.Parse(WT.Rows[i]["wt_PID"].ToString());
                temp.wt_Title = WT.Rows[i]["wt_Title"].ToString();
                temp.wt_Problem = WT.Rows[i]["wt_Problem"].ToString();
                temp.wt_Options = WT.Rows[i]["wt_Options"].ToString();
                temp.wt_Type = WT.Rows[i]["wt_Type"].ToString();
                temp.wt_LimitTime = int.Parse(WT.Rows[i]["wt_LimitTime"].ToString());
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
                            subwt.wt_Title = SubWT.Rows[b]["wt_Title"].ToString();
                            subwt.wt_Problem = SubWT.Rows[b]["wt_Problem"].ToString();
                            subwt.wt_Options = SubWT.Rows[b]["wt_Options"].ToString();
                            subwt.wt_Type = SubWT.Rows[b]["wt_Type"].ToString();
                            subwt.wt_LimitTime = int.Parse(SubWT.Rows[b]["wt_LimitTime"].ToString());
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



        public void Generate_Excle()
        {

        }


    }

    public class WT_Model
    {
        public int wt_ID { get; set; }
        public int wt_WJID { get; set; }
        public string wt_Sleep { get; set; }
        public string wt_OrderNum { get; set; }
        public int wt_PID { get; set; }
        public int wt_LimitTime { get; set; }
        public string wt_Title { get; set; }
        public string wt_Type { get; set; }
        public string wt_Problem { get; set; }
        public string wt_Options { get; set; }
        public string wt_IsAnswer { get; set; }
        public string wt_LogicRelated { get; set; }
        public string wt_Pageing { get; set; }
        public List<WT_Model> Sublist { get; set; }
    }

    public class Pic_Vido
    {
        public string n { get; set; }
        public string t { get; set; }
    }
    public class Item_Model
    {
        public string t { get; set; }
        public string f { get; set; }
        public string o { get; set; }

        public List<Pic_Vido> pv { get; set; }
    }

    //{"cl":"345","o":"1","c":"0","u":"0"}
    public class WD_Model
    {
        public string cl { get; set; }
        public string o { get; set; }
        public string c { get; set; }
        public string u { get; set; }
    }

    public class BG_Model
    {
        public List<string> t { get; set; }
        public List<bg_sub> a { get; set; }

    }
    public class bg_sub
    {
        public string t { get; set; }
        public string f { get; set; }
    }


}