using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Aspose.Words;
using System.Data;
using Aspose.Words.Fields;

namespace SXNU_Questionnaire.Common
{
    public class Question_Export
    {
        public void Generate(string BasePath,string templePath,string savePath)
        {

            
            #region 定义变量
            //建立Document物件,调用模块对word字体和table格式设置
           
            Document doc = new Document(templePath);
            //建立DocumentBuilder物件 
            DocumentBuilder builder = new DocumentBuilder(doc);
            #endregion

            #region 页面设置，设置页面为横向布局，设置纸张类型为A4纸或通过页面的宽度设置
            //设置纸张布局
            builder.PageSetup.PaperSize = PaperSize.A4;
            //builder.PageSetup.Orientation = Aspose.Words.Orientation.Landscape;
            #endregion

            #region 设置word全局的字体样式和字体大小
            builder.RowFormat.Borders.LineStyle = LineStyle.Thick;
            builder.RowFormat.HeightRule = HeightRule.Auto;
            //builder.RowFormat.Alignment = RowAlignment.Center;
            //builder.Font.Name = "仿宋-GB2312";

            builder.Font.Name = "宋体";
            builder.Font.Size = 10.5; //五号

            #endregion


            #region -----插入试卷
            builder.Writeln("请问你最喜欢的国家是哪一个？");
            builder.InsertHtml("<input type='radio'/>");
            builder.Writeln("CN");
            
            builder.InsertHtml("<input type='radio'/>");
            builder.Writeln("USE");
            
            builder.InsertHtml("<input type='radio'/>");
            builder.Writeln("FN");

            builder.InsertHtml("<input type='radio'>");

            builder.Writeln("JP");

            builder.Write("other");
            builder.InsertHtml("<input type='text' />");
           
            //FormField  f= builder.InsertTextInput("",Aspose.Words.Fields.TextFormFieldType.Number,"12312","xxx",20);

            
            builder.Writeln();
            // Specify font formatting

            //Aspose.Words.Font font = builder.Font;
            //font.Size = 12;
            //font.Bold = true;
            //font.Color = System.Drawing.Color.Black;
            //font.Name = "Arial";
            //font.Underline = Underline.None;
            // Specify paragraph formatting 
            //ParagraphFormat paragraphFormat = builder.ParagraphFormat;
            //paragraphFormat.FirstLineIndent = 8;
            //paragraphFormat.Alignment = ParagraphAlignment.Left;
            //paragraphFormat.KeepTogether = false;

            builder.Writeln("请问你最喜欢的手机是哪一种类型的？");
            builder.InsertHtml("<input type='checkbox'  checked='checked'/>");
            builder.Writeln("华为");

            builder.InsertHtml("<input type='checkbox'   checked='checked'/>");
            builder.Writeln("中兴");

            builder.InsertHtml("<input type='checkbox'   checked='checked'/>");
            builder.Writeln("魅族");

            builder.InsertHtml("<input type='checkbox'   checked='checked'/>");
            builder.Writeln("联想");

            builder.Writeln();

            builder.InsertHyperlink("点击查看视频","http://img4.imgtn.bdimg.com/it/u=4236942158,2307642402&fm=21&gp=0.jpg",false);
            builder.InsertHtml(" <a href='http://img4.imgtn.bdimg.com/it/u=4236942158,2307642402&fm=21&gp=0.jpg'>点击查看视频</a>");
           Aspose.Words.Drawing.Shape awds=  builder.InsertImage(BasePath+@"\UploadFiles\g1.gif");
           awds.Width = 20;
           awds.Height = 20;
           
           builder.Writeln();
           Aspose.Words.Drawing.Shape awds1 = builder.InsertImage(BasePath + @"\UploadFiles\g1.gif");
           awds1.Width = 50;
           awds1.Height = 50;
           builder.Writeln();
           Aspose.Words.Drawing.Shape awds2 = builder.InsertImage(BasePath + @"\UploadFiles\g1.gif");
           awds2.Width = 80;
           awds2.Height = 80;
           builder.Writeln();
           Aspose.Words.Drawing.Shape awds3 = builder.InsertImage(BasePath + @"\UploadFiles\g1.gif");
           awds3.Width = 100;
           awds3.Height = 100;
           builder.Writeln();
            //builder.InsertBreak(BreakType.PageBreak);
            //builder.InsertBreak(BreakType.ColumnBreak);
            //builder.InsertBreak(BreakType.ParagraphBreak);

            #endregion


            DataTable dtable = SqlStr_Process.GetListByPage("[Test].[dbo].[user_info]", "", "id", 10000, 10010);
            if (dtable != null && dtable.Rows.Count > 0)
            {
                #region 绘制表格以及设置--------- 开头
                //doc.Range.Bookmarks["tbdw"].Text = "xxxxx";

                    
                Aspose.Words.Tables.Table table = builder.StartTable();
                builder.RowFormat.HeadingFormat = true;
                builder.ParagraphFormat.Alignment = ParagraphAlignment.Center;
                #endregion

                #region 数据集
                for (int i = 0; i < dtable.Rows.Count; i++)
                {
                    for (int j = 0; j < dtable.Columns.Count - 3; j++)
                    {
                        #region 列
                        builder.InsertCell();// 添加一个单元格                    
                        builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                        builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                        builder.CellFormat.Shading.BackgroundPatternColor = System.Drawing.Color.FromArgb(255, 255, 255);
                        builder.CellFormat.Width =120;
                        builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                        //builder.CellFormat.VerticalAlignment = CellVerticalAlignment.Top;//垂直居中对齐
                        builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//水平居中对齐
                        builder.Write(dtable.Rows[i][j].ToString().Trim());
                        //Universal.ExceptionLog((i + 1).ToString() + "*" + (j + 1).ToString(), dtable.Rows[i][j].ToString().Trim());
                        #endregion
                    }

                    builder.EndRow();

                }
                #endregion

                #region 备注列
                builder.InsertCell();// 添加一个单元格                    
                builder.CellFormat.Borders.LineStyle = LineStyle.Single;
                builder.CellFormat.Borders.Color = System.Drawing.Color.Black;
                builder.CellFormat.Shading.BackgroundPatternColor = System.Drawing.Color.FromArgb(255, 255, 255);
                builder.CellFormat.Width = 120;
                builder.RowFormat.Height = 50;
                builder.CellFormat.VerticalMerge = Aspose.Words.Tables.CellMerge.None;
                //builder.CellFormat.VerticalAlignment = CellVerticalAlignment.Top;//垂直居中对齐
                builder.ParagraphFormat.Alignment = ParagraphAlignment.Left;//水平居中对齐
                builder.Write("备注：");
                builder.EndRow();
                #endregion

                #region 绘制表格以及设置--------- 结尾
                builder.EndTable();
                //doc.Range.Bookmarks["pxtx"].Text = "";    // 清掉标示  
                #endregion

                //#region 计划编制和审批人
                //doc.Range.Bookmarks["writername"].Text = dtable.Rows[0]["reg_staff_name"].ToString();
                //doc.Range.Bookmarks["checkname"].Text = dtable.Rows[0]["check_man_name"].ToString();
                //#endregion
            }
            dtable.Dispose();
            #region 保存数据.
            doc.Save(savePath);
            #endregion

        }



        public void Generate_Excle()
        {

        }


    }
}