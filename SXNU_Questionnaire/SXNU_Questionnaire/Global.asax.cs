using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace SXNU_Questionnaire
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

       
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new ExceptionFilterAttribute());  //自己定义的过滤器
        }
        /// <summary>
        /// 2.自己定义的过滤器 处理异常跳转错误页
        /// 捕获异常 跳转到错误页
        /// </summary>
        public class ExceptionFilterAttribute : HandleErrorAttribute
        {
            public override void OnException(ExceptionContext filterContext)
            {
                base.OnException(filterContext);
                filterContext.HttpContext.Response.Redirect("~/Shared/Error.cshtml");
            }
        }


    }
}