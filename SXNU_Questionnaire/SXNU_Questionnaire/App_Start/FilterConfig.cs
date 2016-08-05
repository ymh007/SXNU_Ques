using System.Web;
using System.Web.Mvc;
using SXNU_Questionnaire.Areas.Admin.Models;
 
 
namespace SXNU_Questionnaire
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
    public class AdminFilter : ActionFilterAttribute
    {

        //
        // 摘要: 
        //     在执行操作方法之前由 ASP.NET MVC 框架调用。
        //
        // 参数: 
        //   filterContext:
        //     筛选器上下文。
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            UserInfo User = new UserInfo();
            User = (UserInfo)filterContext.HttpContext.Session["UserInfo"];
            if (User == null)
            {
                filterContext.Result = new RedirectResult("/Admin/Login/Login");
            }
            
        }


        // 摘要: 
        //     在执行操作方法后由 ASP.NET MVC 框架调用。
        //
        // 参数: 
        //   filterContext:
        //     筛选器上下文。
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {

        }
    }
}