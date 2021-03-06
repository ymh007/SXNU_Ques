﻿using SXNU_Questionnaire.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SXNU_Questionnaire.Common
{
    public class JsMessage
    {
        /// <summary>
        /// 后台操作是否成功
        /// </summary>
        public bool IsSuccess { get; set; }

        public string ErrorMsg { get; set; }

        public ArrayList ReturnData { get; set; }
        public int ReturnADD_ID { get; set; }
        public bool IsExist { get; set; }
    }
    public class QueryModel
    {


        public object Data { get; set; }
        public int TotalRecords { get; set; }

        public int CurrenPageIndex { get; set; }

        public int PageSize { get; set; }

        public int BeginIndex { get; set; }
        public string StrWhere { get; set; }
        public int Endindex { get; set; }
        public string LoginName { get; set; }

        public string Role { get; set; }

    }
}