using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SXNU_Questionnaire.Models
{
    public class U_Model
    {

        [Required]
        [Display(Name = "用户名")]
        public string name { get; set; }
        [Required]
        [Display(Name = "年龄")]
        public int age { get; set; }
        [Required]
        [Display(Name = "地址")]
        public string address { get; set; }
        [Required]
        [DataType(DataType.Date)]  
        [Display(Name = "生日")]
        public string birthday { get; set; }
        [Required]
        [Display(Name = "备注")]
        public string mark { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        [Display(Name = "修改时间")]
        public string modify { get; set; }

    }
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