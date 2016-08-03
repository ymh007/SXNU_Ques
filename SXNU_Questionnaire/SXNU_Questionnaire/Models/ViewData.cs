using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SXNU_Questionnaire.Models
{
   
    public class UserInfo
    {
        public int ID { get; set; }

        public string name { get; set; }

        public int age { get; set; }

        public string address { get; set; }

        public string birthday { get; set; }

        public string mark { get; set; }

        public string modify { get; set; }

    }

  


}