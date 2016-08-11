using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using SXNU_Questionnaire.Areas.Admin.Models;
using System.Text;
using SXNU_Questionnaire.Models;

namespace SXNU_Questionnaire.Common
{
    public class SqlStr_Process
    {

        /// <summary>
        /// 获取登陆人信息
        /// </summary>
        /// <param name="u"></param>
        /// <returns></returns>
        public static DataTable GetLoginInfo(UserInfo u)
        {

            string SqlStr = "select * from [SXNU_Questionnaire].[dbo].[AccountManage]  where  am_LoginUser=@am_LoginUser  and  am_PWD=@am_PWD ";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@am_LoginUser",u.U_LoginName),
                new SqlParameter("@am_PWD",u.U_PWD)
            };
            return SqlHelper.GetTable(CommandType.Text, SqlStr, commandParameters)[0];
        }



        /// <summary>
        /// 分页获取数据列表
        /// </summary>
        public static DataTable GetListByPage(string tablename, string strWhere, string orderby, int BeginIndex, int EndIndex)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("SELECT * FROM ( SELECT ROW_NUMBER() OVER (");
            strSql.Append("order by T." + orderby + " desc");
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
        /// 存储过程分页
        /// </summary>
        public static QuesIndex GetListByPro(string strWhere, string orderby, int BeginIndex, int EndIndex)
        {
            QuesIndex Q = new QuesIndex();
            SqlParameter[] commandParameters = new SqlParameter[] { 
                          new SqlParameter("@search",strWhere),
                          new SqlParameter("@BeginIndex",BeginIndex), 
                          new SqlParameter("@EndIndex",EndIndex), 
                          new SqlParameter("@Total",SqlDbType.Int){Direction = ParameterDirection.Output}
            };
            Q.Data = SqlHelper.GetTable(CommandType.StoredProcedure, "NoticeQues", commandParameters)[0];
            Q.Total = int.Parse(commandParameters[3].Value.ToString());
            return Q;
        }
        /// <summary>
        /// 分页获取数据列表 排序列需要做计算 试题排序专用
        /// </summary>
        public static DataTable GetListByPage_Calc(string tablename, string strWhere, int BeginIndex, int EndIndex)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("SELECT * FROM ( SELECT ROW_NUMBER() OVER (");
            strSql.Append("order by  cast(T.wt_OrderNum as float)");
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
        /// 主页展示数据
        /// </summary>
        /// <param name="strSql"></param>
        /// <returns></returns>
        public static DataTable GetIndexData(string strSql)
        {
            SqlParameter[] commandParameters = new SqlParameter[] { };
            return SqlHelper.GetTable(CommandType.Text, strSql, commandParameters)[0];
        }

        /// <summary>
        /// 主页全部通知数据展示 两张表
        /// </summary>
        /// <param name="strSql"></param>
        /// <returns></returns>
        public static DataTableCollection GetNoticeByYear(string strSql)
        {
            SqlParameter[] commandParameters = new SqlParameter[] { };
            return SqlHelper.GetTable(CommandType.Text, strSql, commandParameters);
        }
        public static string ReturnJSONStr()
        {

            string SqlStr = "select  DateName(year,no_PublicTime) as No_Year  from  [dbo].[Notice]  GROUP BY  DateName(year,no_PublicTime) order by No_Year desc; select  DateName(year,no_PublicTime)as No_Year,(DateName(MONTH,no_PublicTime)+'/'+DateName(DAY,no_PublicTime)) as No_md,*   from  [dbo].[Notice] order by no_PublicTime  desc";
            DataTableCollection ds = SqlStr_Process.GetNoticeByYear(SqlStr);
            String ResultJson = "";
            return ResultJson = "{\"Data\":" + JsonTool.DtToJson(ds[1]) + ", \"Years\":" + JsonTool.DtToJson(ds[0]) + "}";
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



        public static DataTable GetWJByID_Answer(int ID)
        {
            string SqlStr = "SELECT   *  FROM  [dbo].[WJ]  where wj_ID=" + ID;
            return SqlStr_Process.GetIndexData(SqlStr);
        }



        /// <summary>
        /// 添加答题人基本信息
        /// </summary>
        /// <param name="Q"></param>
        /// <returns></returns>
        public static JsMessage Add_BaseInfo(AnswerUserInfo au)
        {
            JsMessage js = new JsMessage();
            string SqlStr = @" INSERT INTO [dbo].[AnswerUserInfo] ([au_wjID] ,[au_AnswerUserInfo]) VALUES (@au_wjID,  @au_AnswerUserInfo);SELECT @au_ID=SCOPE_IDENTITY();";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@au_wjID",au.au_wjID),
                new SqlParameter("@au_AnswerUserInfo",SqlDbType.VarChar,1000){Value=au.au_AnswerUserInfo},
                new SqlParameter("@au_ID",SqlDbType.Int){Direction = ParameterDirection.Output}
            };
            try
            {
                int flg = SqlHelper.ExecteNonQueryText(SqlStr, commandParameters);
                if (flg == 1)
                {
                    js.IsSuccess = true;
                    js.ReturnADD_ID = int.Parse(commandParameters[2].Value.ToString());
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


        /// <summary>
        /// 批量保存答案
        /// </summary>
        /// <param name="Q"></param>
        /// <returns></returns>
        public static JsMessage Add_Answer(CommonMode com)
        {
            JsMessage js = new JsMessage();
            List<Answer> list = JsonTool.JSONStringToList<Answer>(com.dataArrayStr);
            SqlParameter[] commandParameters = null;
            int count = list.Count;
            string SqlStr = @" INSERT INTO [dbo].[Answer] ([an_auID],[an_wtID],[an_Result],[an_Invalid],[an_leapfrog],[an_wtType]) VALUES (@an_auID,@an_wtID,@an_Result,@an_Invalid,@an_leapfrog,@an_wtType)";
            foreach (Answer A in list)
            {
                count--;
                commandParameters = new SqlParameter[]{
                    new SqlParameter("@an_auID",com.an_auID),
                    new SqlParameter("@an_wtID",com.an_wtID),
                    new SqlParameter("@an_Result",SqlDbType.VarChar,1000){Value=A.an_Result},
                    new SqlParameter("@an_Invalid",A.an_Invalid),
                    new SqlParameter("@an_leapfrog",A.an_leapfrog),
                    new SqlParameter("@an_wtType",A.an_wtType)
                };
                try
                {
                    int flg = SqlHelper.ExecteNonQueryText(SqlStr, commandParameters);
                    if (count == 0)
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


            }

            return js;
        }
    }
}