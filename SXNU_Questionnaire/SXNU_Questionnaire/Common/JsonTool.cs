using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Reflection;
using System.Collections;
using System.Data.Common;
using System.IO;
using System.Web.Script.Serialization;

namespace SXNU_Questionnaire.Common
{
    //JSON转换类
    public static class JsonTool
    {
      
         

        #region DataTable 转换为Json 字符串
        /// <summary>
        /// DataTable 对象 转换为Json 字符串
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static string DtToJson(DataTable dt)
        {
            JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
            javaScriptSerializer.MaxJsonLength = Int32.MaxValue; //取得最大数值
            ArrayList arrayList = new ArrayList();
            foreach (DataRow dataRow in dt.Rows)
            {
                Dictionary<string, object> dictionary = new Dictionary<string, object>();  //实例化一个参数集合
                foreach (DataColumn dataColumn in dt.Columns)
                {
                    dictionary.Add(dataColumn.ColumnName, dataRow[dataColumn.ColumnName].ToString());
                }
                arrayList.Add(dictionary); //ArrayList集合中添加键值
            }

            return javaScriptSerializer.Serialize(arrayList);  //返回一个json字符串
        }
        #endregion

        public static List<T> JSONStringToList<T>(this string JsonStr)
        {
            JavaScriptSerializer Serializer = new JavaScriptSerializer();

            List<T> objs = Serializer.Deserialize<List<T>>(JsonStr);
            return objs;
        }

        public static object ConvertToList(string json, Type t)
        {
            try
            {
                JavaScriptSerializer Serializer = new JavaScriptSerializer();
                return Serializer.Deserialize(json, t);
            }
            catch
            {
                return null;
            }

        }
        /// <summary>
        /// 把对象转换为json 字符串
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string ObjToJson(object obj)
        {
            string ResultStr = string.Empty;
            if (obj != null)
            {
                JavaScriptSerializer Serializer = new JavaScriptSerializer();
                ResultStr = Serializer.Serialize(obj);
            }
            else
            {
                ResultStr = "";
            }

            return ResultStr;
        }
    }
}