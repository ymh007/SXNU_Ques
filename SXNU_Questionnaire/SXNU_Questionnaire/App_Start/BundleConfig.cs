using System.Web;
using System.Web.Optimization;

namespace SXNU_Questionnaire
{
    public class BundleConfig
    {
        
        // 有关 Bundling 的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {


            //BundleTable.EnableOptimizations = true;
             
            
            bundles.Add(new ScriptBundle("~/js/Common").Include(
           "~/Scripts/jquery-{version}.js",
           "~/Scripts/jquery.loadmask.js",
           "~/Scripts/knockout-2.2.0.js",
           "~/Scripts/jquery-ui-1.8.24.js",
           "~/Scripts/jquery.ui.datepicker.js",
           "~/Scripts/webuploader.js"));



            bundles.Add(new ScriptBundle("~/js/Page").Include(
            "~/Scripts/PageJS/index.js"));
            bundles.Add(new ScriptBundle("~/js/admin/Page").Include(
             "~/Scripts/admin/anq.js"));
            bundles.Add(new ScriptBundle("~/js/admin/Page/login").Include(
           "~/Scripts/admin/login.js"));
            bundles.Add(new ScriptBundle("~/js/admin/Page/ques").Include(
            "~/Scripts/admin/ques.js"));
             

           
            bundles.Add(new StyleBundle("~/Content/themes/base/widtecss").Include(
                 "~/Content/themes/base/jquery-ui.css",
                 "~/Content/themes/base/jquery.loadmask.css"));

            
            bundles.Add(new StyleBundle("~/Content/css/c_css").Include(
                "~/Content/css/css.css",
                "~/Content/css/m-p.css",
                "~/Content/css/w-h.css"));


             
            bundles.Add(new StyleBundle("~/Content/css/a_css").Include(
              "~/Content/css/admin.css",
              "~/Content/css/m-p.css",
              "~/Content/css/w-h.css"));
        }
    }
}