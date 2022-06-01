using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Master_Food.Models;

namespace Master_Food.Controllers
{
    public class DashboardController : Controller
    {
        private readonly Dashboard dashboardModel = new Dashboard();

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetCustomerDetails(int id)
		{
            return dashboardModel.GetCustomerDetails(id);
        }

        [HttpGet]
        public JsonResult GetOrders(int id)
		{
            return dashboardModel.GetOrders(id);
        }

        [HttpGet]
        public JsonResult GetFoodItems()
        {
            return dashboardModel.GetFoodItems();
        }

        [HttpPost]
        public JsonResult EditProfile(Profile data)
        {
            return dashboardModel.EditProfile(data);
        }

        [HttpPost]
        public JsonResult EditOrderDetails(List<OrderDetail> data)
		{
            return dashboardModel.EditOrderDetails(data);
		}
    }
}