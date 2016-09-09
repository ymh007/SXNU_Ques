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
        public string wt_Sleep { get; set; }
        public string wt_OrderNum { get; set; }
        public int wt_PID { get; set; }
        public int wt_LimitTime { get; set; }
        public string wt_Title { get; set; }
        public string wt_Type { get; set; }
        public string wt_Problem { get; set; }
        public string wt_Options { get; set; }
        public string wt_IsAnswer { get; set; }
        public string wt_LogicRelated { get; set; }
        public string wt_Pageing { get; set; }
    }
    public class Up_Down 
    {
        public int Pro_ID { get; set; }

        public string Pro_Num { get; set; }

        public int Pro_PID { get; set; }

        public int Next_ID { get; set; }

        public string Next_Num { get; set; }

        public int Next_PID { get; set; }


    }

    public class Path_Model 
    {
        public string FileName { get; set; }
        public string temppath { get; set; }
        public string savepath { get; set; }
        public string BasePath { get; set; }
        public string logPath { get; set; }

        public string defaultPic { get; set; }
        public string defaultVido { get; set; }

        public string Http_url { get; set; }
    }
     
}