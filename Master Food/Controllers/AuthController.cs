using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Master_Food.Models;

namespace Master_Food.Controllers
{
    public class AuthController : Controller
    {
        private MasterFoodEntities masterFoodEntities = new MasterFoodEntities();

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Signup(Signup data)
        {
            string username = data.Username;
            var password = data.Password;
            string email = data.Email;

            if(!masterFoodEntities.Customers.Any(_customer =>
                _customer.Name == username))
            {
                masterFoodEntities.Customers.Add(new Customer()
                {
                    Name = username,
                    Password = Crypto.HashPassword(password),
                    Email = email
                });

                masterFoodEntities.SaveChanges();

                var customer = masterFoodEntities
                    .Customers
                    .FirstOrDefault(_customer =>
                        _customer.Name == username);

                if(customer != null &&
                    Crypto.VerifyHashedPassword(customer.Password, password))
                    return Json(new
                    {
                        isValidCustomer = true,
                        id = customer.Id,
                        name = customer.Name,
                        email = customer.Email
                    });
            }

            return Json(new
            {
                isValidCustomer = false
            });
        }

        [HttpPost]
        public ActionResult Login(Login data)
        {
            string username = data.Username;
            var password = data.Password;
            
            var customer = masterFoodEntities
                .Customers
                .FirstOrDefault(_customer => _customer.Name == username);

            if (customer != null &&
                Crypto.VerifyHashedPassword(customer.Password, password))
                return Json(new {
                    isValidCustomer = true,
                    id = customer.Id,
                    name = customer.Name,
                    email = customer.Email
                });
            
            return Json(new { isValidCustomer = false });
        }
    }
}