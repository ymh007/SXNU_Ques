using System;
using System.Collections.Generic;
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
}