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

namespace SXNU_Questionnaire.Common
{
    public class Export_Excle
    {
        #region ======================= 导出 Excel =====================



        /// <summary>
        /// Datatable导出Excel
        /// </summary>
        /// <param name="SourceTable"></param>
        /// <returns></returns>
        public static Stream RenderDataTableToExcel(DataTable SourceTable)
        {
            HSSFWorkbook workbook = new HSSFWorkbook();
            MemoryStream ms = new MemoryStream();
            ISheet sheet = workbook.CreateSheet();

            #region 表头及样式

            IRow headerRow1 = sheet.CreateRow(0);
            headerRow1.HeightInPoints = 25;
            headerRow1.CreateCell(0).SetCellValue("xxxxx-问卷调查系统答案收集记录");

            ICellStyle headStyle1 = workbook.CreateCellStyle();
            headStyle1.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            IFont font1 = workbook.CreateFont();
            font1.FontHeight = 18;
            font1.Color = 125;
            font1.FontHeightInPoints = 20;
            font1.Boldweight = 700;

            headStyle1.SetFont(font1);
            headerRow1.GetCell(0).CellStyle = headStyle1;
            sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, SourceTable.Columns.Count - 1));

            #endregion



            #region ================ 测试合并单元格 ===================

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
            row1.CreateCell(2).SetCellValue("xxxxxxxxxx-这是合并单元格 --row2");
            sheet.AddMergedRegion(new CellRangeAddress(2, 2, 0, SourceTable.Columns.Count - 1));


            IRow headerRow = sheet.CreateRow(3);
            HSSFCellStyle headStyle = workbook.CreateCellStyle() as HSSFCellStyle;
            headStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            headStyle.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;//垂直居中

            int[] arrColWidth = new int[SourceTable.Columns.Count];
            //foreach (DataColumn item in SourceTable.Columns)
            //{
            //    arrColWidth[item.Ordinal] = Encoding.GetEncoding(936).GetBytes(item.ColumnName.ToString()).Length;
            //}
            for (int i = 0; i < SourceTable.Rows.Count; i++)
            {
                for (int j = 0; j < SourceTable.Columns.Count; j++)
                {
                    int intTemp = Encoding.GetEncoding(936).GetBytes(SourceTable.Rows[i][j].ToString()).Length;
                    if (intTemp > arrColWidth[j])
                    {
                        arrColWidth[j] = intTemp;
                    }
                }
            }
            foreach (DataColumn column in SourceTable.Columns)
            {
                headerRow.CreateCell(column.Ordinal).SetCellValue(column.ColumnName);
                headerRow.GetCell(column.Ordinal).CellStyle = headStyle;
                sheet.SetColumnWidth(column.Ordinal, (arrColWidth[column.Ordinal] + 10) * 256);
            }


            // handling value.
            int rowIndex = 4;
            HSSFCellStyle rowStyle = workbook.CreateCellStyle() as HSSFCellStyle;
            rowStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
            rowStyle.VerticalAlignment = NPOI.SS.UserModel.VerticalAlignment.Center;//垂直居中
            rowStyle.WrapText = true;
            foreach (DataRow row in SourceTable.Rows)
            {
                IRow dataRow = sheet.CreateRow(rowIndex);
                foreach (DataColumn column in SourceTable.Columns)
                {
                    HSSFCell newCell = dataRow.CreateCell(column.Ordinal) as HSSFCell;
                    string drValue = row[column].ToString();
                    double result;
                    if (isNumeric(drValue, out result))
                    {
                        double.TryParse(drValue, out result);
                        newCell.SetCellValue(result);
                    }
                    else
                    {
                        newCell.SetCellValue(drValue);
                    }
                    dataRow.GetCell(column.Ordinal).CellStyle = rowStyle;
                }

                rowIndex++;
            }

            workbook.Write(ms);
            ms.Flush();
            ms.Position = 0;

            sheet = null;
            headerRow = null;
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

        /// <summary>
        /// Datatable导出Excel
        /// </summary>
        /// <param name="SourceTable"></param>
        /// <param name="FileName"></param>
        public static void RenderDataTableToExcel(DataTable SourceTable, string FileName)
        {
            MemoryStream ms = RenderDataTableToExcel(SourceTable) as MemoryStream;
            FileStream fs = new FileStream(FileName, FileMode.Create, FileAccess.Write);
            byte[] data = ms.ToArray();

            fs.Write(data, 0, data.Length);
            fs.Flush();
            fs.Close();

            data = null;
            ms = null;
            fs = null;
        }

        #endregion
    }
}