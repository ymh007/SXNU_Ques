using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SXNU_Questionnaire.Areas.Admin.Models
{

    /// <summary>
    /// 账户信息
    /// </summary>
    public class UserInfo
    {
        public int U_ID { get; set; }
        public string U_LoginName { get; set; }
        public string U_PWD { get; set; }
        public string U_Name { get; set; }

        public string U_Email { get; set; }
        public string U_Phone { get; set; }
        public string U_Status { get; set; }

        public string U_Role { get; set; }
        public string CreateTime { get; set; }

    }
}