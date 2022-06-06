using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Master_Food.Models;

namespace Master_Food.Controllers
{
    public class FindFoodController : Controller
    {

        private FindFoodPage findFoodPage = new FindFoodPage();

        [HttpGet]
        public ActionResult Index()
        {
            return View(findFoodPage);
        }

        [HttpPost]
        public ActionResult AcceptOrders(List<FindFoodPage.FoodOrders> data)
		{
            return findFoodPage.AcceptOrders(data);
        }
    }
}