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
    public class Export_Excle
    {
        #region ======================= 导出 Excel =====================

        
        public static List<WT_Model> ProcessDataOrder(int wjid)
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
     

        /// <summary>
        /// Datatable导出Excel
        /// </summary>
        /// <param name="SourceTable"></param>
        /// <returns></returns>
        public static Stream RenderDataTableToExcel(int wjid,string wjTitle)
        {
            List<WT_Model> WtList = Export_Excle.ProcessDataOrder(wjid);
            DataTable wj = SqlStr_Process.GetWJByID_Answer(wjid);
            string wj_Title = wj.Rows[0]["wj_Title"].ToString();

            HSSFWorkbook workbook = new HSSFWorkbook();
            MemoryStream ms = new MemoryStream();
            ISheet sheet = workbook.CreateSheet();

            #region 表头及样式

            IRow headerRow1 = sheet.CreateRow(0);
            headerRow1.HeightInPoints = 25;
            headerRow1.CreateCell(0).SetCellValue(wj_Title);

            ICellStyle headStyle1 = workbook.CreateCellStyle();
            headStyle1.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            IFont font1 = workbook.CreateFont();
            font1.FontHeight = 18;
            font1.Color = 125;
            font1.FontHeightInPoints = 20;
            font1.Boldweight = 700;

            headStyle1.SetFont(font1);
            headerRow1.GetCell(0).CellStyle = headStyle1;
            sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, WtList.Count - 1));

            #endregion



            //#region ================ 测试合并单元格 ===================

            ICellStyle headStyle2 = workbook.CreateCellStyle();
            headStyle2.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Left;
            IFont font2 = workbook.CreateFont();
            font2.FontHeight = 12;
            font2.Color = (short)FontColor.Red;
            font2.FontHeightInPoints = 13;
            font2.Boldweight = 500;
            headStyle2.SetFont(font2);

            IRow row1 = sheet.CreateRow(1);
            row1.CreateCell(0).SetCellValue("xxxxxxxxxx-这是合并单元格---row0");
            row1.CreateCell(4).SetCellValue("xxxxxxxxxx-这是合并单元格 --row1");
            row1.CreateCell(9).SetCellValue(" 这是合并单元格 --row2");
            sheet.AddMergedRegion(new CellRangeAddress(1, 1, 0, 3));
            sheet.AddMergedRegion(new CellRangeAddress(1, 1, 4, 8));
            sheet.AddMergedRegion(new CellRangeAddress(1, 1, 9, 11));

            row1.GetCell(0).CellStyle = headStyle2;
            row1.GetCell(4).CellStyle = headStyle2;
            row1.GetCell(9).CellStyle = headStyle2;

            IRow row2 = sheet.CreateRow(2);
            row2.CreateCell(0).SetCellValue("测试单元格合并");
            row2.GetCell(0).CellStyle = headStyle1;


            #endregion
            //row1.CreateCell(2).SetCellValue("xxxxxxxxxx-这是合并单元格 --row2");
            //sheet.AddMergedRegion(new CellRangeAddress(2, 2, 0, SourceTable.Columns.Count - 1));


            //IRow headerRow = sheet.CreateRow(3);
            //HSSFCellStyle headStyle = workbook.CreateCellStyle() as HSSFCellStyle;
            //headStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            //headStyle.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;//垂直居中

            //int[] arrColWidth = new int[SourceTable.Columns.Count];
            ////foreach (DataColumn item in SourceTable.Columns)
            ////{
            ////    arrColWidth[item.Ordinal] = Encoding.GetEncoding(936).GetBytes(item.ColumnName.ToString()).Length;
            ////}
            //for (int i = 0; i < SourceTable.Rows.Count; i++)
            //{
            //    for (int j = 0; j < SourceTable.Columns.Count; j++)
            //    {
            //        int intTemp = Encoding.GetEncoding(936).GetBytes(SourceTable.Rows[i][j].ToString()).Length;
            //        if (intTemp > arrColWidth[j])
            //        {
            //            arrColWidth[j] = intTemp;
            //        }
            //    }
            //}
            //foreach (DataColumn column in SourceTable.Columns)
            //{
            //    headerRow.CreateCell(column.Ordinal).SetCellValue(column.ColumnName);
            //    headerRow.GetCell(column.Ordinal).CellStyle = headStyle;
            //    sheet.SetColumnWidth(column.Ordinal, (arrColWidth[column.Ordinal] + 10) * 256);
            //}


            //// handling value.
            //int rowIndex = 4;
            //HSSFCellStyle rowStyle = workbook.CreateCellStyle() as HSSFCellStyle;
            //rowStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            //rowStyle.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;//垂直居中
            //rowStyle.WrapText = true;
            //foreach (DataRow row in SourceTable.Rows)
            //{
            //    IRow dataRow = sheet.CreateRow(rowIndex);
            //    foreach (DataColumn column in SourceTable.Columns)
            //    {
            //        HSSFCell newCell = dataRow.CreateCell(column.Ordinal) as HSSFCell;
            //        string drValue = row[column].ToString();
            //        double result;
            //        if (isNumeric(drValue, out result))
            //        {
            //            double.TryParse(drValue, out result);
            //            newCell.SetCellValue(result);
            //        }
            //        else
            //        {
            //            newCell.SetCellValue(drValue);
            //        }
            //        dataRow.GetCell(column.Ordinal).CellStyle = rowStyle;
            //    }

            //    rowIndex++;
            //}

            workbook.Write(ms);
            ms.Flush();
            ms.Position = 0;

            sheet = null;
            //headerRow = null;
            workbook = null;

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

        //#endregion
    }
}