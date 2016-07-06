using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SXNU_Questionnaire.Areas.Admin.Models
{
    public class NoticeInfo
    {
        public int No_ID { get; set; }
        public string No_Title { get; set; }
        public string No_Content { get; set; }
        public string No_PublicTime { get; set; }
        public string No_IsExpired { get; set; }
    }
}