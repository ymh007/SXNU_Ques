using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SXNU_Questionnaire.Areas.Admin.Models
{
    public class QuestionInfo
    {
        public int wj_ID { get; set; }
        public string wj_ProjectSource { get; set; }
       
        public string wj_Number { get; set; }
        public string wj_Sponsor { get; set; }
        public string wj_Time { get; set; }
        public string wj_Title { get; set; }
        public string wj_BeginPic { get; set; }
        public string wj_BeginBody { get; set; }
        public string wj_EndBody { get; set; }
        public string wj_PageSize { get; set; }
        public string wj_PublishTime { get; set; }
        public string wj_Status { get; set; }
        public string wj_ValidStart { get; set; }
        public string wj_ValidEnd { get; set; }
        public string wj_BaseInfo { get; set; }

    }
}