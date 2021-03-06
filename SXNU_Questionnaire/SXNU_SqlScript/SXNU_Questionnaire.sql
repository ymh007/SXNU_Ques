USE [master]
GO
/****** Object:  Database [SXNU_Questionnaire]    Script Date: 2016/11/3 21:15:31 ******/
CREATE DATABASE [SXNU_Questionnaire]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'SXNU_Questionnaire', FILENAME = N'D:\DB_File\SXNU_Questionnaire.mdf' , SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'SXNU_Questionnaire_log', FILENAME = N'D:\DB_File\SXNU_Questionnaire_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [SXNU_Questionnaire] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [SXNU_Questionnaire].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [SXNU_Questionnaire] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET ARITHABORT OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [SXNU_Questionnaire] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [SXNU_Questionnaire] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [SXNU_Questionnaire] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET  DISABLE_BROKER 
GO
ALTER DATABASE [SXNU_Questionnaire] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [SXNU_Questionnaire] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [SXNU_Questionnaire] SET  MULTI_USER 
GO
ALTER DATABASE [SXNU_Questionnaire] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [SXNU_Questionnaire] SET DB_CHAINING OFF 
GO
ALTER DATABASE [SXNU_Questionnaire] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [SXNU_Questionnaire] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [SXNU_Questionnaire]
GO
/****** Object:  StoredProcedure [dbo].[NoticeQues]    Script Date: 2016/11/3 21:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
 
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================

CREATE  PROCEDURE  [dbo].[NoticeQues](
@search     nvarchar(200),
@BeginIndex int, 
@EndIndex int,
@Total int out  
)
AS 
BEGIN
 
 IF object_id('tempdb..#NQ_T') is  null 
 Begin
 CREATE TABLE #NQ_T
( 
ID INT ,
N_Q char(1),
Title VARCHAR(1000),  
Content  VARCHAR(8000), 
publishTime VARCHAR(50),
StartTime VARCHAR(50),
EndTime VARCHAR(50),
publishP VARCHAR(100),
IsExpire char(1),
QStatus char(1),
V_Code VARCHAR(15)
)   
End
IF(Len(@search) > 0)
BEGIN
INSERT INTO #NQ_T  SELECT  [wj_ID] ,'q',[wj_Title],'',CONVERT(varchar(100),[wj_PublishTime], 23) ,
CONVERT(varchar(100),[wj_ValidStart], 23),CONVERT(varchar(100),[wj_ValidEnd], 23),[wj_Sponsor],
CASE WHEN ([wj_ValidEnd] > GETDATE()) THEN 'n'  ELSE 'y' END, [wj_Status] , wj_Number
FROM  [dbo].[WJ]   WHERE [wj_Status]='y' and  wj_Title like '%'+@search +'%'  ORDER BY [wj_PublishTime] DESC;
  
INSERT INTO #NQ_T SELECT   [no_ID] ,'n' ,[no_Title],[no_Content],CONVERT(varchar(100),[no_PublicTime], 23) ,'','' ,'' , '','',''
FROM [dbo].[Notice]  WHERE  no_Title like '%'+@search +'%'  ORDER BY  no_PublicTime DESC;

SELECT * FROM ( SELECT ROW_NUMBER() OVER ( order by  publishTime  desc)AS Row, *  from  #NQ_T  ) TT   WHERE TT.Row between @BeginIndex and @EndIndex
SELECT @Total=COUNT(1)  FROM  #NQ_T;
END
ELSE
BEGIN

SELECT * FROM ( SELECT ROW_NUMBER() OVER ( order by  [wj_PublishTime]  desc)AS Row, [wj_ID] AS ID,'q' AS N_Q,[wj_Title] AS  Title,'' AS Content ,CONVERT(varchar(100),[wj_PublishTime], 23) AS publishTime,
CONVERT(varchar(100),[wj_ValidStart], 23) AS  StartTime,CONVERT(varchar(100),[wj_ValidEnd], 23) AS EndTime,[wj_Sponsor] AS publishP,
CASE WHEN ([wj_ValidEnd] > GETDATE()) THEN 'n'  ELSE 'y' END AS IsExpire, [wj_Status]  AS QStatus,[wj_Number] AS V_Code from  [dbo].[WJ]  WHERE [wj_Status]='y') TT   WHERE TT.Row between @BeginIndex and @EndIndex
SELECT @Total=COUNT(1)  FROM  [dbo].[WJ]  WHERE [wj_Status]='y';
END
TRUNCATE TABLE  #NQ_T;
END



GO
/****** Object:  Table [dbo].[AccountManage]    Script Date: 2016/11/3 21:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[AccountManage](
	[am_ID] [int] IDENTITY(1,1) NOT NULL,
	[am_LoginUser] [varchar](50) NOT NULL,
	[am_PWD] [varchar](20) NOT NULL,
	[am_Email] [varchar](50) NOT NULL,
	[am_Name] [nvarchar](50) NULL,
	[am_Phone] [varchar](11) NULL,
	[am_Status] [varchar](10) NOT NULL,
	[am_CreateTime] [datetime] NOT NULL,
	[am_Role] [varchar](5) NOT NULL,
 CONSTRAINT [PK_AccountManage] PRIMARY KEY CLUSTERED 
(
	[am_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Answer]    Script Date: 2016/11/3 21:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Answer](
	[an_ID] [int] IDENTITY(1,1) NOT NULL,
	[an_auID] [int] NOT NULL,
	[an_wtID] [int] NOT NULL,
	[an_Result] [nvarchar](1000) NULL,
	[an_Invalid] [char](1) NOT NULL,
	[an_leapfrog] [char](1) NOT NULL,
	[an_wtType] [char](1) NOT NULL,
 CONSTRAINT [PK_Answer] PRIMARY KEY CLUSTERED 
(
	[an_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[AnswerUserInfo]    Script Date: 2016/11/3 21:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AnswerUserInfo](
	[au_ID] [int] IDENTITY(1,1) NOT NULL,
	[au_wjID] [int] NOT NULL,
	[au_AnswerUserInfo] [nvarchar](1000) NOT NULL,
	[au_Time] [nvarchar](5) NOT NULL,
	[au_Name] [nchar](10) NOT NULL,
 CONSTRAINT [PK_AnswerUserInfo] PRIMARY KEY CLUSTERED 
(
	[au_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Notice]    Script Date: 2016/11/3 21:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Notice](
	[no_ID] [int] IDENTITY(1,1) NOT NULL,
	[no_Title] [nvarchar](100) NOT NULL,
	[no_Content] [nvarchar](3000) NOT NULL,
	[no_PublicTime] [datetime] NOT NULL,
	[no_IsExpired] [varchar](10) NOT NULL,
 CONSTRAINT [PK_Notice] PRIMARY KEY CLUSTERED 
(
	[no_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[SystemSetting]    Script Date: 2016/11/3 21:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[SystemSetting](
	[ss_ID] [int] IDENTITY(1,1) NOT NULL,
	[ss_Title] [nvarchar](100) NULL,
	[ss_Value] [nvarchar](100) NULL,
	[ss_Length] [int] NULL,
	[ss_IsRequired] [char](5) NULL,
	[ss_FieldType] [varchar](100) NOT NULL,
	[ss_ModifyTime] [datetime] NOT NULL,
	[ss_ModifyUser] [varchar](50) NOT NULL,
 CONSTRAINT [PK_SystemSetting] PRIMARY KEY CLUSTERED 
(
	[ss_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Total_Group]    Script Date: 2016/11/3 21:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Total_Group](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[GroupName] [nvarchar](50) NOT NULL,
	[WJID] [int] NOT NULL,
	[IDValue] [nvarchar](2000) NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[WJ]    Script Date: 2016/11/3 21:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[WJ](
	[wj_ID] [int] IDENTITY(1,1) NOT NULL,
	[wj_ProjectSource] [nvarchar](100) NULL,
	[wj_Number] [varchar](20) NOT NULL,
	[wj_Sponsor] [varchar](50) NOT NULL,
	[wj_Time] [varchar](5) NOT NULL,
	[wj_Title] [nvarchar](200) NULL,
	[wj_BeginPic] [nvarchar](100) NULL,
	[wj_BeginBody] [nvarchar](max) NULL,
	[wj_EndBody] [nvarchar](max) NULL,
	[wj_PageSize] [varchar](5) NULL,
	[wj_PublishTime] [datetime] NULL,
	[wj_Status] [nvarchar](10) NULL,
	[wj_ValidStart] [date] NULL,
	[wj_ValidEnd] [date] NOT NULL,
	[wj_BaseInfo] [nvarchar](max) NULL,
 CONSTRAINT [PK_WJ] PRIMARY KEY CLUSTERED 
(
	[wj_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[WT]    Script Date: 2016/11/3 21:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[WT](
	[wt_ID] [int] IDENTITY(1,1) NOT NULL,
	[wt_Sleep] [nvarchar](500) NULL,
	[wt_OrderNum] [nvarchar](10) NOT NULL,
	[wt_Title] [nchar](1000) NOT NULL,
	[wt_WJID] [int] NOT NULL,
	[wt_PID] [int] NOT NULL,
	[wt_LimitTime] [int] NULL,
	[wt_Type] [nvarchar](20) NOT NULL,
	[wt_Problem] [nvarchar](1000) NOT NULL,
	[wt_Options] [nvarchar](4000) NULL,
	[wt_IsAnswer] [varchar](2) NOT NULL,
	[wt_LogicRelated] [nvarchar](2000) NULL,
	[wt_Pageing] [char](1) NOT NULL,
 CONSTRAINT [PK_WT] PRIMARY KEY CLUSTERED 
(
	[wt_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
USE [master]
GO
ALTER DATABASE [SXNU_Questionnaire] SET  READ_WRITE 
GO
