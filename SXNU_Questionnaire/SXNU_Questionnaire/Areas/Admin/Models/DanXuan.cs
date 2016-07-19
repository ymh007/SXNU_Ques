using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SXNU_Questionnaire.Areas.Admin.Models
{
    public class DanXuan
    {
        public int wt_ID { get; set; }
        public int wt_WJID { get; set; }
        public int wt_PID { get; set; }
        public int  wt_LimitTime { get; set; }
        public string wt_Title { get; set; }
        public string wt_Type { get; set; }
        public string wt_Problem { get; set; }
        public string wt_Options { get; set; }
        public string wt_IsAnswer { get; set; }
        public string wt_LogicRelated { get; set; }
    }
}