USE [SXNU_Questionnaire]
GO
/****** Object:  Trigger [dbo].[trig_delete_answer]    Script Date: 2016/8/31 16:34:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create TRIGGER  [dbo].[trig_delete_answer]
 ON [dbo].[AnswerUserInfo]
   AFTER DELETE
 AS
 BEGIN
 SET NOCOUNT  ON;
 DECLARE @au_id INT;
 DECLARE cur_del CURSOR LOCAL  forward_only for  
SELECT au_ID   from deleted 
OPEN  cur_del   
FETCH NEXT FROM cur_del INTO @au_id 
WHILE @@fetch_status = 0
BEGIN
DELETE FROM [dbo].[Answer]  WHERE  [an_auID]= @au_id
FETCH NEXT FROM cur_del INTO @au_id   
END  
END
