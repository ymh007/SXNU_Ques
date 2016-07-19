using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using SXNU_Questionnaire.Models;
using System.Text;

namespace SXNU_Questionnaire.Common
{
    public class SqlStr_Process
    {

        /// <summary>
        /// 分页获取数据列表
        /// </summary>
        public static DataTable GetListByPage(string tablename, string strWhere, string orderby, int BeginIndex, int EndIndex)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("SELECT * FROM ( SELECT ROW_NUMBER() OVER (");
            strSql.Append("order by T." + orderby);
            strSql.AppendFormat(")AS Row, T.*  from {0} T ", tablename);
            if (!string.IsNullOrEmpty(strWhere.Trim()))
            {
                strSql.Append(" WHERE " + strWhere);
            }
            strSql.Append(" ) TT");
            strSql.AppendFormat(" WHERE TT.Row between {0} and {1} ", BeginIndex, EndIndex);
            SqlParameter[] commandParameters = new SqlParameter[] { };
            return SqlHelper.GetTable(CommandType.Text, strSql.ToString(), commandParameters)[0];
        }
         
 
        /// <summary>
        /// 分页获取数据  可自定义字段  CONVERT(varchar(100), GETDATE(), 23): 2006-05-16
        /// </summary>
        /// <param name="tablename"></param>
        /// <param name="Fields"> 要查询的字段列表 </param>
        /// <param name="strWhere"></param>
        /// <param name="orderby"></param>
        /// <param name="BeginIndex"></param>
        /// <param name="EndIndex"></param>
        /// <returns></returns>
        public static DataTable GetListByPage(string tablename, string Fields, string strWhere, string orderby, int BeginIndex, int EndIndex)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("SELECT  " + Fields + "  FROM ( SELECT ROW_NUMBER() OVER (");
            strSql.Append("order by T." + orderby);
            strSql.AppendFormat(")AS Row, T.*  from {0} T ", tablename);
            if (!string.IsNullOrEmpty(strWhere.Trim()))
            {
                strSql.Append(" WHERE " + strWhere);
            }
            strSql.Append(" ) TT");
            strSql.AppendFormat(" WHERE TT.Row between {0} and {1} ", BeginIndex, EndIndex);
            SqlParameter[] commandParameters = new SqlParameter[] { };
            return SqlHelper.GetTable(CommandType.Text, strSql.ToString(), commandParameters)[0];
        }


        /// <summary>
        /// 获取总记录数
        /// </summary>
        /// <param name="TableName">表名称</param>
        /// <param name="StrWhere">查询条件 不带 where</param>
        /// <returns>返回整形结果</returns>
        public static int GetTotalRecord(string TableName, string StrWhere)
        {
            int resullt = 0;
            string SqlExe = "SELECT COUNT(1) FROM " + TableName;
            if (StrWhere.Trim() != "")
            {
                SqlExe = SqlExe + " WHERE " + StrWhere;
            }
            try
            {
                resullt = int.Parse(SqlHelper.ExecuteScalarText(SqlExe, null).ToString());
            }
            catch (SqlException ex)
            {
                System.IO.File.AppendAllText("C:/error.log", "数据库操作=====" + DateTime.Now.ToString() + "====" + ex.ToString());
                resullt = -1;
            }
            return resullt;
        }


        public static IList<UserInfo> GetDataByList()
        {

            string SqlStr = "SELECT [id] ,[name] ,[age] ,[address], CONVERT(VARCHAR(10),[birthday],23) as birthday  ,[mark]  ,CONVERT(VARCHAR(50),[modify],120)as modify FROM [Test].[dbo].[user_info]";
            //SqlStr = "SELECT * FROM [Test].[dbo].[user_info] ";
            SqlParameter[] commandParameters = new SqlParameter[] { };
            DataTable dt = SqlHelper.GetTable(CommandType.Text, SqlStr, commandParameters)[0];
            IList<UserInfo> Ilist = ModelConvertHelper<UserInfo>.ConvertToModel(dt);
            return Ilist;

        }

        public static DataTable GetDataByDataTable()
        {
            string SqlStr = "SELECT [id] ,[name] ,[age] ,[address], CONVERT(VARCHAR(10),[birthday],23) as birthday  ,[mark]  ,CONVERT(VARCHAR(50),[modify],120)as modify FROM [Test].[dbo].[user_info]";
            SqlParameter[] commandParameters = new SqlParameter[] { };
            DataTable dt = SqlHelper.GetTable(CommandType.Text, SqlStr, commandParameters)[0];
            return dt;
        }



        public static JsMessage Add_Userinfo(UserInfo ui)
        {
            JsMessage js = new JsMessage();
            string SqlStr = " insert into user_info(name,age,[address],birthday,mark) values(@name,@age,@address,@birthday,@mark)";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@name",ui.name),
                new SqlParameter("@age",ui.age),
                new SqlParameter("@address",ui.address),
                new SqlParameter("@birthday",ui.birthday),
                new SqlParameter("@mark",ui.mark)
            };
            try
            {
                int flg = SqlHelper.ExecteNonQueryText(SqlStr, commandParameters);
                if (flg == 1)
                {
                    js.IsSuccess = true;
                }
                else
                {
                    js.IsSuccess = false;
                }
            }
            catch (SqlException ex)
            {
                js.IsSuccess = false;
                js.ErrorMsg = ex.ToString();
            }
            return js;
        }

        public static JsMessage DeleteUser(int ID)
        {
            JsMessage js = new JsMessage();
            string SqlStr = " DELETE FROM [dbo].[user_info] WHERE ID=@ID";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@ID",ID)
            };
            try
            {
                int flg = SqlHelper.ExecteNonQueryText(SqlStr, commandParameters);
                if (flg == 1)
                {
                    js.IsSuccess = true;
                }
                else
                {
                    js.IsSuccess = false;
                }
            }
            catch (SqlException ex)
            {
                js.IsSuccess = false;
                js.ErrorMsg = ex.ToString();
            }
            return js;


        }

    }
}