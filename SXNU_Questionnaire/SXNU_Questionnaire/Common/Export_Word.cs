using Aspose.Words;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

 
namespace SXNU_Questionnaire.Common
{
    public class Export_Word
    {
        private int Docversion=2003; // version
        private DocumentBuilder oWordApplic; //   a   reference   to   Word   application 
        private Aspose.Words.Document oDoc; //   a   reference   to   the   document 
        public void OpenWithTemplate(string strFileName)
        {
            if (!string.IsNullOrEmpty(strFileName))
            {
                oDoc = new Aspose.Words.Document(strFileName);
            }
        }

        public void Open()
        {
            oDoc = new Aspose.Words.Document();
        }

        public void Builder()
        {
            oWordApplic = new DocumentBuilder(oDoc);
            
            
        }
        /// <summary>
        /// 保存文件
        /// </summary>
        /// <param name="strFileName"></param>
        public void SaveAs(string strFileName)
        {
            if (this.Docversion == 2007)
            {
                oDoc.Save(strFileName,SaveFormat.Docx); 
            }else
            {
                oDoc.Save(strFileName,SaveFormat.Doc); 
                 
            }
           
        }

        /// <summary>
        /// 添加内容
        /// </summary>
        /// <param name="strText"></param>
        public void InsertText(string strText, double conSize, bool conBold, string conAlign)
        {
            oWordApplic.Bold = conBold;
            oWordApplic.Font.Size = conSize;
            switch (conAlign)
            {
                case "left":
                    oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Left;
                    break;
                case "center":
                    oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Center;
                    break;
                case "right":
                    oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Right;
                    break;
                default:
                    oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Left;
                    break;
            }
            oWordApplic.Writeln(strText);
             
        }

        /// <summary>
        /// 添加内容
        /// </summary>
        /// <param name="strText"></param>
        public void WriteText(string strText, double conSize, bool conBold, string conAlign)
        {
            oWordApplic.Bold = conBold;
            oWordApplic.Font.Size = conSize;
            switch (conAlign)
            {
                case "left":
                    oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Left;
                    break;
                case "center":
                    oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Center;
                    break;
                case "right":
                    oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Right;
                    break;
                default:
                    oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Left;
                    break;
            }
            oWordApplic.Write(strText);

        }


        #region 设置纸张
        public void setPaperSize(string papersize)
        {

            switch (papersize)
            {
                case "A4":
                    foreach (Aspose.Words.Section section in oDoc)
                    {
                        section.PageSetup.PaperSize = PaperSize.A4;
                        section.PageSetup.Orientation = Orientation.Portrait;
                        section.PageSetup.VerticalAlignment = Aspose.Words.PageVerticalAlignment.Top;
                    }
                    break;
                case "A4H"://A4横向
                    foreach (Aspose.Words.Section section in oDoc)
                    {
                        section.PageSetup.PaperSize = PaperSize.A4;
                        section.PageSetup.Orientation = Orientation.Landscape;
                        section.PageSetup.TextColumns.SetCount(2);
                        section.PageSetup.TextColumns.EvenlySpaced = true;
                        section.PageSetup.TextColumns.LineBetween =true;
                        //section.PageSetup.LeftMargin = double.Parse("3.35");
                        //section.PageSetup.RightMargin =double.Parse("0.99");
                    }
                    break;
                case "A3":
                    foreach (Aspose.Words.Section section in oDoc)
                    {
                        section.PageSetup.PaperSize = PaperSize.A3;
                        section.PageSetup.Orientation = Orientation.Portrait;
                       
                    }
                   
                    break;
                case "A3H"://A3横向

                    foreach (Aspose.Words.Section section in oDoc)
                    {
                        section.PageSetup.PaperSize = PaperSize.A3;
                        section.PageSetup.Orientation = Orientation.Landscape;
                        section.PageSetup.TextColumns.SetCount(2);
                        section.PageSetup.TextColumns.EvenlySpaced = true;
                        section.PageSetup.TextColumns.LineBetween = true;

                    }

                    break;

                case "16K":

                    foreach (Aspose.Words.Section section in oDoc)
                    {
                        section.PageSetup.PaperSize = PaperSize.B5;
                        section.PageSetup.Orientation = Orientation.Portrait;

                    }
                   
                    break;

                case "8KH":

                    foreach (Aspose.Words.Section section in oDoc)
                    {

                        section.PageSetup.PageWidth = double.Parse("36.4 ");//纸张宽度
                        section.PageSetup.PageHeight = double.Parse("25.7");//纸张高度
                        section.PageSetup.Orientation = Orientation.Landscape;
                        section.PageSetup.TextColumns.SetCount(2);
                        section.PageSetup.TextColumns.EvenlySpaced = true;
                        section.PageSetup.TextColumns.LineBetween = true;
                        //section.PageSetup.LeftMargin = double.Parse("3.35");
                        //section.PageSetup.RightMargin = double.Parse("0.99");
                    }

                 

                    break;
            }
        }
        #endregion

        public void SetHeade(string strBookmarkName, string text)
        {
            if (oDoc.Range.Bookmarks[strBookmarkName] != null)
            {
                Aspose.Words.Bookmark mark = oDoc.Range.Bookmarks[strBookmarkName];
                mark.Text = text;
            }
        }
        public void InsertFile(string vfilename)
        {
            Aspose.Words.Document srcDoc = new Aspose.Words.Document(vfilename);
                      Node insertAfterNode = oWordApplic.CurrentParagraph.PreviousSibling;
                      InsertDocument(insertAfterNode, oDoc, srcDoc);
           
        }

        public void InsertFile(string vfilename, string strBookmarkName,int pNum)
        {
            //Aspose.Words.Document srcDoc = new Aspose.Words.Document(vfilename);
            //Aspose.Words.Bookmark bookmark = oDoc.Range.Bookmarks[strBookmarkName];
            //InsertDocument(bookmark.BookmarkStart.ParentNode, srcDoc);
            //替换插入word内容
            oWordApplic.Document.Range.Replace(new System.Text.RegularExpressions.Regex(strBookmarkName),
                new InsertDocumentAtReplaceHandler(vfilename, pNum), false);
           

        }
        /// <summary>
        /// 插入word内容
        /// </summary>
        /// <param name="insertAfterNode"></param>
        /// <param name="mainDoc"></param>
        /// <param name="srcDoc"></param>
        public static void InsertDocument(Node insertAfterNode, Aspose.Words.Document mainDoc, Aspose.Words.Document srcDoc)
        {
            // Make sure that the node is either a pargraph or table.
            if ((insertAfterNode.NodeType != NodeType.Paragraph)
                & (insertAfterNode.NodeType != NodeType.Table))
                throw new Exception("The destination node should be either a paragraph or table.");

            //We will be inserting into the parent of the destination paragraph.

            CompositeNode dstStory = insertAfterNode.ParentNode;

            //Remove empty paragraphs from the end of document

            while (null != srcDoc.LastSection.Body.LastParagraph && !srcDoc.LastSection.Body.LastParagraph.HasChildNodes)
            {
                srcDoc.LastSection.Body.LastParagraph.Remove();
            }
            NodeImporter importer = new NodeImporter(srcDoc, mainDoc, ImportFormatMode.KeepSourceFormatting);

            //Loop through all sections in the source document.

            int sectCount = srcDoc.Sections.Count;

            for (int sectIndex = 0; sectIndex < sectCount; sectIndex++)
            {
                Aspose.Words.Section srcSection = srcDoc.Sections[sectIndex];
                //Loop through all block level nodes (paragraphs and tables) in the body of the section.
                int nodeCount = srcSection.Body.ChildNodes.Count;
                for (int nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++)
                {
                    Node srcNode = srcSection.Body.ChildNodes[nodeIndex];
                    Node newNode = importer.ImportNode(srcNode, true);
                    dstStory.InsertAfter(newNode, insertAfterNode);
                    insertAfterNode = newNode;
                }
            }
        }

        static void InsertDocument(Node insertAfterNode, Aspose.Words.Document srcDoc)
        {
            // Make sure that the node is either a paragraph or table.
            if ((!insertAfterNode.NodeType.Equals(NodeType.Paragraph)) &
              (!insertAfterNode.NodeType.Equals(NodeType.Table)))
                throw new ArgumentException("The destination node should be either a paragraph or table.");

            // We will be inserting into the parent of the destination paragraph.
            CompositeNode dstStory = insertAfterNode.ParentNode;

            // This object will be translating styles and lists during the import.
            NodeImporter importer = new NodeImporter(srcDoc, insertAfterNode.Document, ImportFormatMode.KeepSourceFormatting);

            // Loop through all sections in the source document.
            foreach (Aspose.Words.Section srcSection in srcDoc.Sections)
            {
                // Loop through all block level nodes (paragraphs and tables) in the body of the section.
                foreach (Node srcNode in srcSection.Body)
                {
                    // Let's skip the node if it is a last empty paragraph in a section.
                    if (srcNode.NodeType.Equals(NodeType.Paragraph))
                    {
                        Aspose.Words.Paragraph para = (Aspose.Words.Paragraph)srcNode;
                        if (para.IsEndOfSection && !para.HasChildNodes)
                            continue;
                    }

                    // This creates a clone of the node, suitable for insertion into the destination document.
                    Node newNode = importer.ImportNode(srcNode, true);

                    // Insert new node after the reference node.
                    dstStory.InsertAfter(newNode, insertAfterNode);
                    insertAfterNode = newNode;
                }
            }
        }
        /// <summary>
        /// 换行
        /// </summary>
        public void InsertLineBreak()
        {
            oWordApplic.InsertBreak(BreakType.LineBreak);
        }
        /// <summary>
        /// 换多行
        /// </summary>
        /// <param name="nline"></param>
        public void InsertLineBreak(int nline)
        {
            for (int i = 0; i < nline; i++)
                oWordApplic.InsertBreak(BreakType.LineBreak);
        }

        #region InsertScoreTable
        public bool InsertScoreTable(bool dishand, bool distab, string handText)
        {
            try
            {

            
                oWordApplic.StartTable();//开始画Table
                oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Left;
                //添加Word表格
                oWordApplic.InsertCell();
                oWordApplic.CellFormat.Width = 115.0;
                oWordApplic.CellFormat.PreferredWidth = Aspose.Words.Tables.PreferredWidth.FromPoints(115);
                oWordApplic.CellFormat.Borders.LineStyle = LineStyle.None;
               
                oWordApplic.StartTable();//开始画Table
                oWordApplic.RowFormat.Height = 20.2;
                oWordApplic.InsertCell();
                oWordApplic.CellFormat.Borders.LineStyle = LineStyle.Single;
                oWordApplic.Font.Size = 10.5;
                oWordApplic.Bold = false;
                oWordApplic.Write("评卷人");

                oWordApplic.CellFormat.VerticalAlignment = Aspose.Words.Tables.CellVerticalAlignment.Center;//垂直居中对齐
                oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Center;
                oWordApplic.CellFormat.Width = 50.0;
                oWordApplic.CellFormat.PreferredWidth = Aspose.Words.Tables.PreferredWidth.FromPoints(50);
                oWordApplic.RowFormat.Height = 20.0;
                oWordApplic.InsertCell();
                oWordApplic.CellFormat.Borders.LineStyle = LineStyle.Single;
                oWordApplic.Font.Size = 10.5;
                oWordApplic.Bold = false;
                oWordApplic.Write("得分");
                oWordApplic.CellFormat.VerticalAlignment = Aspose.Words.Tables.CellVerticalAlignment.Center;//垂直居中对齐
                oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Center;
                oWordApplic.CellFormat.Width = 50.0;
                oWordApplic.CellFormat.PreferredWidth = Aspose.Words.Tables.PreferredWidth.FromPoints(50);
                oWordApplic.EndRow();
                oWordApplic.RowFormat.Height = 25.0;
                oWordApplic.InsertCell();
                oWordApplic.RowFormat.Height = 25.0;
                oWordApplic.InsertCell();
                oWordApplic.EndRow();
                oWordApplic.EndTable();

                oWordApplic.InsertCell();
                oWordApplic.CellFormat.Width = 300.0;
                oWordApplic.CellFormat.PreferredWidth = Aspose.Words.Tables.PreferredWidth.Auto;
                oWordApplic.CellFormat.Borders.LineStyle = LineStyle.None;

               
                oWordApplic.CellFormat.VerticalAlignment = Aspose.Words.Tables.CellVerticalAlignment.Center;//垂直居中对齐
                oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Left;
                oWordApplic.Font.Size = 11;
                oWordApplic.Bold = true;
                oWordApplic.Write(handText);
                oWordApplic.EndRow();
                oWordApplic.RowFormat.Height = 28 ;
                oWordApplic.EndTable();
                return true;
            }
            catch
            {

                return false;
            }

        }
        #endregion
         #region 插入表格
        public bool InsertTable(System.Data.DataTable dt, bool haveBorder)
        {
            Aspose.Words.Tables.Table  table= oWordApplic.StartTable();//开始画Table
            ParagraphAlignment paragraphAlignmentValue = oWordApplic.ParagraphFormat.Alignment;
            oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Center;
            //添加Word表格
            for (int row = 0; row < dt.Rows.Count; row++)
            {
                 oWordApplic.RowFormat.Height =25;
                for (int col = 0; col < dt.Columns.Count; col++)
                {
                    oWordApplic.InsertCell();
                    oWordApplic.Font.Size = 10.5;
                    oWordApplic.Font.Name = "宋体";
                    oWordApplic.CellFormat.VerticalAlignment = Aspose.Words.Tables.CellVerticalAlignment.Center;//垂直居中对齐
                    oWordApplic.ParagraphFormat.Alignment = ParagraphAlignment.Center;//水平居中对齐
                    oWordApplic.CellFormat.Width = 50.0;
                    oWordApplic.CellFormat.PreferredWidth = Aspose.Words.Tables.PreferredWidth.FromPoints(50);
                    if (haveBorder == true)
                    {
                        //设置外框样式   
                        oWordApplic.CellFormat.Borders.LineStyle = LineStyle.Single;
                        //样式设置结束   
                    }

                    oWordApplic.Write(dt.Rows[row][col].ToString());
                }

                oWordApplic.EndRow();

            }
            oWordApplic.EndTable();
            oWordApplic.ParagraphFormat.Alignment = paragraphAlignmentValue;
            table.Alignment=Aspose.Words.Tables.TableAlignment.Center;
            table.PreferredWidth = Aspose.Words.Tables.PreferredWidth.Auto;
          


            return true;
        }
        #endregion


        public void InsertPagebreak( )
        {
           
            oWordApplic.InsertBreak(BreakType.PageBreak);
            
        }
    
       

 
        private class InsertDocumentAtReplaceHandler : IReplacingCallback
        {
            private string vfilename;
            private int pNum;

            public InsertDocumentAtReplaceHandler(string filename, int _pNum)
            {
                this.vfilename = filename;
                this.pNum = _pNum;
            }
            ReplaceAction IReplacingCallback.Replacing(ReplacingArgs e)
            {
                Document subDoc = new Document(this.vfilename);
                subDoc.FirstSection.Body.FirstParagraph.InsertAfter(new Run(subDoc, this.pNum + "."), null);
                
                // Insert a document after the paragraph, containing the match text.
                Node currentNode = e.MatchNode;
                Paragraph para = (Paragraph)e.MatchNode.ParentNode;
                InsertDocument(para, subDoc);
                // Remove the paragraph with the match text.
                e.MatchNode.Remove();
                e.MatchNode.Range.Delete();



                return ReplaceAction.Skip;
            }
        }


         

    }

     


}
 


