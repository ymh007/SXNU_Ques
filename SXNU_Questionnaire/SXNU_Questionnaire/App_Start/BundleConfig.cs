using System.Web;
using System.Web.Optimization;

namespace SXNU_Questionnaire
{
    public class BundleConfig
    {
        // 有关 Bundling 的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {



            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(  "~/Scripts/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(  "~/Scripts/jquery-ui-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(  "~/Scripts/jquery.unobtrusive*",  "~/Scripts/jquery.validate*"));

            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(  "~/Scripts/modernizr-*"));


            //bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            //bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
            //            "~/Content/themes/base/jquery.ui.core.css",
            //            "~/Content/themes/base/bootstrap.css",
            //            "~/Content/themes/base/jquery.ui.resizable.css",
            //            "~/Content/themes/base/jquery.ui.selectable.css",
            //            "~/Content/themes/base/jquery.ui.accordion.css",
            //            "~/Content/themes/base/jquery.ui.autocomplete.css",
            //            "~/Content/themes/base/jquery.ui.button.css",
            //            "~/Content/themes/base/jquery.ui.dialog.css",
            //            "~/Content/themes/base/jquery.ui.slider.css",
            //            "~/Content/themes/base/jquery.ui.tabs.css",
            //            "~/Content/themes/base/jquery.ui.datepicker.css",
            //            "~/Content/themes/base/jquery.ui.progressbar.css",
            //            "~/Content/themes/base/jquery.ui.theme.css"));


            //  公共脚本
            bundles.Add(new ScriptBundle("~/js/Common").Include(
           "~/Scripts/jquery-{version}.js",
           "~/Scripts/jquery.loadmask.js",
           "~/Scripts/knockout-2.2.0.js"));



            bundles.Add(new ScriptBundle("~/js/Page").Include(
            "~/Scripts/PageJS/index.js"));
            bundles.Add(new ScriptBundle("~/js/admin/Page").Include(
             "~/Scripts/admin/anq.js"));
            bundles.Add(new ScriptBundle("~/js/admin/Page/login").Include(
           "~/Scripts/admin/login.js"));
            bundles.Add(new ScriptBundle("~/js/admin/Page/ques").Include(
             "~/Scripts/jquery-ui-1.8.24.js",
             "~/Scripts/jquery.ui.datepicker.js",
              "~/Scripts/webuploader.js",
            "~/Scripts/admin/ques.js"));
           // bundles.Add(new ScriptBundle("~/js/admin/Page/account").Include(
           // "~/Scripts/admin/account.js"));

           // bundles.Add(new ScriptBundle("~/js/admin/Page/ques").Include(
           //"~/Scripts/admin/ques.js"));

           // bundles.Add(new ScriptBundle("~/js/admin/Page/notice").Include(
           //"~/Scripts/admin/notice.js"));

             //  前台页面
            bundles.Add(new StyleBundle("~/Content/PageCss").Include(
                 "~/Content/css/css.css",
                 "~/Content/css/m-p.css",
                 "~/Content/css/w-h.css"));




            bundles.Add(new StyleBundle("~/Content/admin/PageCss").Include(
               "~/Content/themes/base/jquery-ui.css",
               "~/Content/themes/base/jquery.loadmask.css",
               "~/Content/css/admin.css",
               "~/Content/css/m-p.css",
               "~/Content/css/w-h.css"));





            //bundles.Add(new StyleBundle("~/Content/QuesCss").Include(
            //     "~/Content/themes/base/jquery-ui.css",
            //     "~/Content/themes/base/jquery.loadmask.css"));

        }
    }
}