using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;


namespace SXNU_Questionnaire.Models
{
    public class ImageStore
    {
        public int ImageStore_nbr { get; set; }
        public string Name { get; set; }

        public string MimeType { get; set; }

        public byte[] Content { get; set; }
    }

    public class QuesIndex
    {
        public int Total { get; set; }

        public DataTable Data { get; set; }

    }

    public class AnswerUserInfo
    {
        public int au_ID { get; set; }
        public int au_wjID { get; set; }
        public string au_AnswerUserInfo { get; set; }
        public string au_Time { get; set; }
        public string au_Name { get; set; }
    }


    public class Answer
    {
        public int an_ID { get; set; }
        public int an_auID { get; set; }
        public int an_wtID { get; set; }
        public string an_Result { get; set; }
        public string an_Invalid { get; set; } // y n
        public string an_leapfrog { get; set; }// y n
        public string an_wtType { get; set; }

    }
    public class CommonMode
    {
        public string au_Time { get; set; }
        public string an_auID { get; set; }
        public string dataArrayStr { get; set; }

    } 

}
