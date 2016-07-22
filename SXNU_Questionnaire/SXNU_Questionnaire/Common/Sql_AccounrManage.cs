using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Text;
using SXNU_Questionnaire.Areas.Admin.Models;
namespace SXNU_Questionnaire.Common
{
    /// <summary>
    /// 账号管理
    /// </summary>
    public class Sql_AccounrManage
    {
        public static JsMessage Add_Userinfo(UserInfo u)
        {
            JsMessage js = new JsMessage();
            string SqlStr = "INSERT INTO [dbo].[AccountManage] ([am_LoginUser],[am_PWD],[am_Email],[am_Name],[am_Phone],[am_Status],[am_CreateTime]) values(@am_LoginUser,@am_PWD,@am_Email,@am_Name,@am_Phone,@am_Status,@am_CreateTime)";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@am_LoginUser",u.U_LoginName),
                new SqlParameter("@am_PWD",u.U_PWD),
                new SqlParameter("@am_Email",u.U_Email),
                //new SqlParameter("@am_Name",u.U_Name),
                //new SqlParameter("@am_Phone",u.U_Phone),
                new SqlParameter("@am_Name",""),
                new SqlParameter("@am_Phone",""),
                new SqlParameter("@am_Status",u.U_Status),
                new SqlParameter("@am_CreateTime",u.CreateTime)
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




        /// <summary>
        /// 修改用户信息
        /// </summary>
        /// <param name="u"></param>
        /// <returns></returns>
        /*  
         * UPDATE [dbo].[AccountManage] SET [am_LoginUser] =''  ,[am_PWD] =,
                 [am_Email] = '',
                 [am_Name] ='',
                 [am_Phone] = '',
                 [am_Status] = '',
                 [am_CreateTime] = ''
                    WHERE  [am_ID]=@am_ID
         */
        public static JsMessage Modify_Userinfo(UserInfo u)
        {
            JsMessage js = new JsMessage();
            string SqlStr = "UPDATE [dbo].[AccountManage] SET [am_LoginUser] =@am_LoginUser,[am_Email] =@am_Email  WHERE  [am_ID]=@am_ID";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@am_LoginUser",u.U_LoginName),
                new SqlParameter("@am_Email",u.U_Email),
                new SqlParameter("@am_ID",u.U_ID)
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


        public static JsMessage EnableAccount(int ID)
        {
            string SqlStr = "UPDATE [dbo].[AccountManage] SET [am_Status] =@am_Status  WHERE  [am_ID]=@am_ID";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@am_Status","n"),
                new SqlParameter("@am_ID",ID)
            };
            return Modify_Userinfo(SqlStr, commandParameters);
        }


        public static JsMessage ResetPwd(int ID)
        {
            string SqlStr = "UPDATE [dbo].[AccountManage] SET [am_PWD] =@am_PWD   WHERE  [am_ID]=@am_ID";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@am_PWD","123456"),
                new SqlParameter("@am_ID",ID)
            };
            return Modify_Userinfo(SqlStr, commandParameters);
        }




        public static JsMessage Modify_Userinfo(string SqlStr, SqlParameter[] commandParameters)
        {
            JsMessage js = new JsMessage();
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
        public static JsMessage CheckUserIsExist(string LoginName)
        {
            JsMessage js = new JsMessage();
            string SqlStr = " SELECT  count(1)  FROM [SXNU_Questionnaire].[dbo].[AccountManage]	WHERE  am_LoginUser=@am_LoginUser";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@am_LoginUser",LoginName)
            };
            try
            {
                js.IsExist = SqlHelper.Exists(SqlStr, commandParameters);
                js.IsSuccess = true;
            }
            catch (SqlException ex)
            {
                js.IsSuccess = false;
                js.ErrorMsg = ex.ToString();
            }
            return js;


        }



    }


    /// <summary>
    /// 账号管理
    /// </summary>
    public class Sql_NoticeManage
    {




        public static JsMessage Add_Notice(NoticeInfo no)
        {
            JsMessage js = new JsMessage();
            string SqlStr = "INSERT INTO [dbo].[Notice] ([no_Title],[no_Content],[no_PublicTime],[no_IsExpired]) values (@no_Title,@no_Content,@no_PublicTime,@no_IsExpired)";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@no_Title",no.No_Title),
                new SqlParameter("@no_Content",no.No_Content),
                new SqlParameter("@no_PublicTime",no.No_PublicTime), 
                new SqlParameter("@no_IsExpired",no.No_IsExpired)
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




        /// <summary>
        /// 修改用户信息
        /// </summary>
        /// <param name="u"></param>
        /// <returns></returns>
        /*  
         * UPDATE [dbo].[AccountManage] SET [am_LoginUser] =''  ,[am_PWD] =,
                 [am_Email] = '',
                 [am_Name] ='',
                 [am_Phone] = '',
                 [am_Status] = '',
                 [am_CreateTime] = ''
                    WHERE  [am_ID]=@am_ID
         */
        public static JsMessage Modify_Notice(NoticeInfo no)
        {
            JsMessage js = new JsMessage();
            string SqlStr = "UPDATE [dbo].[Notice] SET [no_Title] =@no_Title,[no_Content] =@no_Content  WHERE  [no_ID]=@no_ID";

            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@no_Title",no.No_Title),
                new SqlParameter("@no_Content",no.No_Content),
                new SqlParameter("@no_ID",no.No_ID)
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

        public static JsMessage Delete_Notice(int ID)
        {
            JsMessage js = new JsMessage();
            string SqlStr = "DELETE FROM [dbo].[Notice]  WHERE  [no_ID]=@no_ID";
            SqlParameter[] commandParameters = new SqlParameter[] { new SqlParameter("@no_ID", ID) };
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


        public static JsMessage Modify_Notice(string SqlStr, SqlParameter[] commandParameters)
        {
            JsMessage js = new JsMessage();
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



    /// <summary>
    /// 试卷管理
    /// </summary>
    public class Sql_QuestionManage
    {


        /// <summary>
        /// 添加问卷
        /// </summary>
        /// <param name="Q"></param>
        /// <returns></returns>
        public static JsMessage Add_Question(QuestionInfo Q)
        {
            JsMessage js = new JsMessage();
            string SqlStr = @" INSERT INTO [dbo].[WJ] (
                                [wj_ProjectSource]
                               ,[wj_Number]
                               ,[wj_Sponsor]
                               ,[wj_Time]
                               ,[wj_Title]
                               ,[wj_BeginPic]
                               ,[wj_BeginBody]
                               ,[wj_EndBody]
                               ,[wj_PageSize]
                               ,[wj_PublishTime]
                               ,[wj_Status]
                               ,[wj_ValidStart]
                               ,[wj_ValidEnd]
                               ,[wj_BaseInfo] )
                            VALUES
                             (  @wj_ProjectSource
                               ,@wj_Number
                               ,@wj_Sponsor
                               ,@wj_Time
                               ,@wj_Title
                               ,@wj_BeginPic
                               ,@wj_BeginBody
                               ,@wj_EndBody
                               ,@wj_PageSize
                               ,@wj_PublishTime
                               ,@wj_Status
                               ,@wj_ValidStart
                               ,@wj_ValidEnd
                               ,@wj_BaseInfo );SELECT @wj_ID=SCOPE_IDENTITY();";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@wj_ProjectSource",SqlDbType.NVarChar,100){Value=Q.wj_ProjectSource},
                new SqlParameter("@wj_Number",Q.wj_Number),
                new SqlParameter("@wj_Sponsor",Q.wj_Sponsor), 
                new SqlParameter("@wj_Time",Q.wj_Time),
                new SqlParameter("@wj_Title",Q.wj_Title),
                new SqlParameter("@wj_BeginPic",SqlDbType.VarChar,100){Value=Q.wj_BeginPic},
                new SqlParameter("@wj_BeginBody",SqlDbType.NVarChar,8000){Value=Q.wj_BeginBody},
                new SqlParameter("@wj_EndBody",SqlDbType.NVarChar,2000){Value=Q.wj_EndBody},
                new SqlParameter("@wj_PageSize",Q.wj_PageSize),
                new SqlParameter("@wj_PublishTime",Q.wj_PublishTime),
                new SqlParameter("@wj_Status",Q.wj_Status),
                new SqlParameter("@wj_ValidStart",Q.wj_ValidStart),
                new SqlParameter("@wj_ValidEnd",Q.wj_ValidEnd),
                new SqlParameter("@wj_BaseInfo",SqlDbType.NVarChar,8000){Value=Q.wj_BaseInfo},
                new SqlParameter("@wj_ID",SqlDbType.Int){Direction = ParameterDirection.Output}
            };


            try
            {
                int flg = SqlHelper.ExecteNonQueryText(SqlStr, commandParameters);

                if (flg == 1)
                {
                    js.IsSuccess = true;
                    js.ReturnADD_ID = int.Parse(commandParameters[14].Value.ToString());
                }
                else
                {
                    js.IsSuccess = false;
                }

            }
            catch (SqlException ex)
            {
                js.IsSuccess = true;
                js.ErrorMsg = ex.ToString();
            }
            return js;
        }


        /// <summary>
        /// 修改问卷
        /// </summary>
        /// <param name="Q"></param>
        /// <returns></returns>
        public static JsMessage Modify_Question(QuestionInfo Q)
        {
            JsMessage js = new JsMessage();
            string SqlStr = @" UPDATE [dbo].[WJ]
                           SET [wj_ProjectSource]= @wj_ProjectSource,
                              [wj_Number]      =  @wj_Number,
                              [wj_Sponsor]     =  @wj_Sponsor,
                              [wj_Time]        =  @wj_Time,
                              [wj_Title]       =  @wj_Title,
                              [wj_BeginPic]    =  @wj_BeginPic,
                              [wj_BeginBody]   =  @wj_BeginBody,
                              [wj_EndBody]     =  @wj_EndBody,
                              [wj_PageSize]    =  @wj_PageSize,
                              [wj_PublishTime] =  @wj_PublishTime,
                              [wj_Status]      =  @wj_Status,
                              [wj_ValidStart]  =  @wj_ValidStart,
                              [wj_ValidEnd]    =  @wj_ValidEnd,
                              [wj_BaseInfo]    =  @wj_BaseInfo 
                         WHERE [wj_ID]=@wj_ID ";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@wj_ProjectSource",SqlDbType.NVarChar,100){Value=Q.wj_ProjectSource},
                new SqlParameter("@wj_Number",Q.wj_Number),
                new SqlParameter("@wj_Sponsor",Q.wj_Sponsor), 
                new SqlParameter("@wj_Time",Q.wj_Time),
                new SqlParameter("@wj_Title",Q.wj_Title),
                new SqlParameter("@wj_BeginPic",SqlDbType.VarChar,100){Value=Q.wj_BeginPic},
                new SqlParameter("@wj_BeginBody",SqlDbType.NVarChar,8000){Value=Q.wj_BeginBody},
                new SqlParameter("@wj_EndBody",SqlDbType.NVarChar,2000){Value=Q.wj_EndBody},
                new SqlParameter("@wj_PageSize",Q.wj_PageSize),
                new SqlParameter("@wj_PublishTime",Q.wj_PublishTime),
                new SqlParameter("@wj_Status",Q.wj_Status),
                new SqlParameter("@wj_ValidStart",Q.wj_ValidStart),
                new SqlParameter("@wj_ValidEnd",Q.wj_ValidEnd),
                new SqlParameter("@wj_BaseInfo",SqlDbType.NVarChar,8000){Value=Q.wj_BaseInfo},
                new SqlParameter("@wj_ID",Q.wj_ID)
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


        /// <summary>
        /// 修改问卷
        /// </summary>
        /// <param name="Q"></param>
        /// <returns></returns>
        public static JsMessage Modify_Question_BaseInfo(QuestionInfo Q)
        {
            JsMessage js = new JsMessage();
            string SqlStr = @" UPDATE [dbo].[WJ]
                           SET [wj_BaseInfo]    =  @wj_BaseInfo   WHERE [wj_ID]=@wj_ID ";
            SqlParameter[] commandParameters = new SqlParameter[]{ 
                new SqlParameter("@wj_BaseInfo",SqlDbType.NVarChar,8000){Value=Q.wj_BaseInfo},
                new SqlParameter("@wj_ID",Q.wj_ID)
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



    /// <summary>
    /// 试题管理
    /// </summary>
    public class Sql_STManage
    {



        /// <summary>
        /// 删除试题
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public static JsMessage Delete_SJ(int ID)
        {
            JsMessage js = new JsMessage();
            string SqlStr = "DELETE FROM [dbo].[WT]  WHERE  [wt_ID]=@wt_ID";
            SqlParameter[] commandParameters = new SqlParameter[] { new SqlParameter("@wt_ID", ID) };
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

        /// <summary>
        /// 添加试题
        /// </summary>
        /// <param name="Q"></param>
        /// <returns></returns>
        public static JsMessage Add_DXST(DanXuan DX)
        {
            JsMessage js = new JsMessage();
            string SqlStr = @" INSERT INTO [dbo].[WT]
                               ([wt_WJID]
                               ,[wt_OrderNum]
                               ,[wt_Title]
                               ,[wt_PID]
                               ,[wt_LimitTime]
                               ,[wt_Type]
                               ,[wt_Problem]
                               ,[wt_Options]
                               ,[wt_IsAnswer]
                               ,[wt_LogicRelated])
                         VALUES
                               (@wt_WJID,
                                @wt_OrderNum,
                                @wt_Title,
                                @wt_PID,
                                @wt_LimitTime,
                                @wt_Type, 
                                @wt_Problem, 
                                @wt_Options, 
                                @wt_IsAnswer, 
                                @wt_LogicRelated);SELECT @wt_ID=SCOPE_IDENTITY();";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@wt_WJID",DX.wt_WJID),
                new SqlParameter("@wt_OrderNum",DX.wt_OrderNum),
                new SqlParameter("@wt_Title",DX.wt_Title),
                new SqlParameter("@wt_PID",DX.wt_PID),
                new SqlParameter("@wt_LimitTime",DX.wt_LimitTime), 
                new SqlParameter("@wt_Type",DX.wt_Type),
                new SqlParameter("@wt_Problem",SqlDbType.VarChar,400){Value=DX.wt_Problem},
                new SqlParameter("@wt_Options",SqlDbType.VarChar,4000){Value=DX.wt_Options},
                new SqlParameter("@wt_IsAnswer",SqlDbType.NVarChar,10){Value=DX.wt_IsAnswer},
                new SqlParameter("@wt_LogicRelated",SqlDbType.NVarChar,2000){Value=DX.wt_LogicRelated},
                new SqlParameter("@wt_ID",SqlDbType.Int){Direction = ParameterDirection.Output}
            };
            try
            {
                int flg = SqlHelper.ExecteNonQueryText(SqlStr, commandParameters);
                if (flg == 1)
                {
                    js.IsSuccess = true;
                    js.ReturnADD_ID = int.Parse(commandParameters[10].Value.ToString());
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
        /// 修改试题
        /// </summary>
        /// <param name="Q"></param>
        /// <returns></returns>
        public static JsMessage Modify_ST(DanXuan DX)
        {
            JsMessage js = new JsMessage();
            string SqlStr = @" UPDATE [dbo].[WT]
                              SET  [wt_Title] = @wt_Title,
                                   [wt_LimitTime]=@wt_LimitTime,
                                   [wt_Type]=@wt_Type,
                                   [wt_Problem]=@wt_Problem,
                                   [wt_Options]= @wt_Options  WHERE [wt_ID]=@wt_ID";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@wt_Title",DX.wt_Title),
                new SqlParameter("@wt_LimitTime",DX.wt_LimitTime), 
                new SqlParameter("@wt_Type",DX.wt_Type),
                new SqlParameter("@wt_Problem",SqlDbType.VarChar,400){Value=DX.wt_Problem},
                new SqlParameter("@wt_Options",SqlDbType.VarChar,4000){Value=DX.wt_Options},
                new SqlParameter("@wt_ID",DX.wt_ID)
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
        /// <summary>
        /// 添加组合题
        /// </summary>
        /// <param name="Q"></param>
        /// <returns></returns>
        public static JsMessage Add_ZHST(DanXuan DX)
        {
            JsMessage js = new JsMessage();
            string SqlStr = @" INSERT INTO [dbo].[WT]
                               ([wt_WJID]
                               ,[wt_OrderNum]
                               ,[wt_Title]
                               ,[wt_PID]
                               ,[wt_LimitTime]
                               ,[wt_Type]
                               ,[wt_Problem]
                               ,[wt_Options]
                               ,[wt_IsAnswer]
                               ,[wt_LogicRelated])
                         VALUES
                               (@wt_WJID,
                                @wt_OrderNum,
                                @wt_Title,
                                @wt_PID,
                                @wt_LimitTime,
                                @wt_Type, 
                                @wt_Problem, 
                                @wt_Options, 
                                @wt_IsAnswer, 
                                @wt_LogicRelated);SELECT @wt_ID=SCOPE_IDENTITY();";
            SqlParameter[] commandParameters = new SqlParameter[]{
                new SqlParameter("@wt_WJID",DX.wt_WJID),
                new SqlParameter("@wt_OrderNum",DX.wt_OrderNum),
                new SqlParameter("@wt_Title",DX.wt_Title),
                new SqlParameter("@wt_PID",DX.wt_PID),
                new SqlParameter("@wt_LimitTime",DX.wt_LimitTime), 
                new SqlParameter("@wt_Type",DX.wt_Type),
                new SqlParameter("@wt_Problem",SqlDbType.VarChar,400){Value=DX.wt_Problem},
                new SqlParameter("@wt_Options",SqlDbType.VarChar,4000){Value=DX.wt_Options},
                new SqlParameter("@wt_IsAnswer",SqlDbType.NVarChar,10){Value=DX.wt_IsAnswer},
                new SqlParameter("@wt_LogicRelated",SqlDbType.NVarChar,2000){Value=DX.wt_LogicRelated},
                new SqlParameter("@wt_ID",SqlDbType.Int){Direction = ParameterDirection.Output}
            };
            try
            {
                int flg = SqlHelper.ExecteNonQueryText(SqlStr, commandParameters);
                if (flg == 1)
                {
                    js.IsSuccess = true;
                    js.ReturnADD_ID = int.Parse(commandParameters[10].Value.ToString());
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