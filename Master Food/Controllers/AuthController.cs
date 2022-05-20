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

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Signup(Signup data)
        {
            return Auth.Signup(data);
        }

        [HttpPost]
        public ActionResult Login(Login data)
        {
            return Auth.Login(data);
        }
    }
}