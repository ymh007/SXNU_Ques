using ICSharpCode.SharpZipLib.Checksums;
using ICSharpCode.SharpZipLib.Zip;
using System;
using System.IO;
using System.IO.Compression;
using System.Web.Mvc;
namespace SXNU_Questionnaire.Common
{
    public  class ComproessionFiles
    {

        /// <summary>
        /// 使用第三方组件压缩一个目录下面的所有的文件
        /// </summary>
        /// <param name="SourceFile">要压缩的文件目录路径</param>
        /// <param name="DestinationFile">生成的压缩包路径</param>
        /// <returns></returns>
        public bool CompressFiles(string SourceFile, string DestinationFile) 
        {
            
            bool Result = true;
            if (!Directory.Exists(SourceFile))
            {
                Directory.CreateDirectory(SourceFile);
            }
            string[] subFile = Directory.GetFiles(SourceFile);
            Crc32 crc = new Crc32();
            ZipOutputStream outPutStream = new ZipOutputStream(File.Create(DestinationFile));
            outPutStream.SetLevel(9);
            try 
            {
                for (int i = 0; i < subFile.Length; i++)
                {
                    FileStream fileStream = File.OpenRead(subFile[i]);
                    byte[] buffer = new byte[fileStream.Length];
                    fileStream.Read(buffer, 0, buffer.Length);
                    ZipEntry entry = new ZipEntry(subFile[i].Replace(SourceFile, ""));
                    entry.DateTime = DateTime.Now;
                    entry.Size = fileStream.Length;
                    fileStream.Close();
                    crc.Reset();
                    crc.Update(buffer);
                    entry.Crc = crc.Value;
                    outPutStream.PutNextEntry(entry);
                    outPutStream.Write(buffer, 0, buffer.Length);
                }
            }
            catch(Exception ex)
            {
                Result=false;
                System.IO.File.AppendAllText(@"F:\error.log", "压缩文件=====" + DateTime.Now.ToString() + "====" + ex.ToString());
            }
            finally
            {
                outPutStream.Finish();
                outPutStream.Close();
                GC.Collect();  
            }
            
            return Result;
        }


        /// <summary>
        /// 压缩单个文件使用不适用第三方组件
        /// </summary>
        /// <param name="SourceFile"></param>
        /// <param name="DestinationFile"></param>
        /// <returns></returns>
        public Boolean CompressFile(string SourceFile,string DestinationFile) 
        {
            bool IsSuccess = true;
            if (!File.Exists(SourceFile))
            {
               return IsSuccess = false;
            }

            byte[] Buffer = null;
            FileStream SourceStream = null;
            FileStream DestinationStream = null;
            GZipStream CompressionStream = null;
              
            try
            {
                SourceStream = new FileStream(SourceFile, FileMode.Open, FileAccess.Read);
                Buffer=new byte[SourceStream.Length];
                SourceStream.Read(Buffer, 0, Buffer.Length);
                DestinationStream = new FileStream(DestinationFile, FileMode.OpenOrCreate, FileAccess.Write);
                CompressionStream = new GZipStream(DestinationStream, CompressionMode.Compress,false);
                CompressionStream.Write(Buffer, 0, Buffer.Length);
 

            }
            catch (Exception ex)
            {
               
                IsSuccess = false;
            }
            finally 
            {
                if (SourceStream != null) 
                {
                    SourceStream.Close();
                }
                if (CompressionStream != null) 
                {
                    CompressionStream.Close();
                }
                if (DestinationStream != null) 
                {
                    DestinationStream.Close();
                }

            }
             
            return IsSuccess;
        }
    }
}