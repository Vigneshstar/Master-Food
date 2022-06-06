using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Master_Food.Models;

namespace Master_Food.Controllers
{
    public class HomeController : Controller
    {
        HomePage homePage = new HomePage();

        [HttpGet]
        public ActionResult Index()
        {
            return View(homePage);
        }

        [HttpPost]
        public ActionResult AddToFavFoods(HomePage.FavFoodItem data)
		{
            return homePage.AddToFavFoods(data);
		}

        [HttpDelete]
        public ActionResult RemoveFromFavFoods(int id)
        {
            return homePage.RemoveFromFavFoods(id);
        }
    }
}
