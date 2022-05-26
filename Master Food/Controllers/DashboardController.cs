using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Master_Food.Models;

namespace Master_Food.Controllers
{
    public class DashboardController : Controller
    {
        private MasterFoodEntities db = new MasterFoodEntities();

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult EditProfile(EditProfile data)
        {
            //Request.Files
            return data.UpdateDetails();
        }

        [HttpGet]
        public JsonResult GetCustomerDetails(int id)
		{
            var customer = db.Customers
                .Where(_customer => _customer.Id == id)
                .FirstOrDefault();

            string name = customer.Name,
                email = customer.Email,
                imagePath = customer.Image,
                type = customer.Type,
                address = customer.Address;

            return Json(new { Data = new { id, name, email, imagePath, type, address } }, JsonRequestBehavior.AllowGet);
		}
    }
}