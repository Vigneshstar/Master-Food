using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Master_Food.Models
{
	public class Auth
	{
		private static MasterFoodEntities db = new MasterFoodEntities();

		public static JsonResult Signup(Signup data)
		{
			string username = data.Username;
            var password = data.Password;
            string email = data.Email;
            string type = "regular";

            if (!db.Customers.Any(_customer =>
                _customer.Name == username))
            {
                db.Customers.Add(new Customer()
                {
                    Name = username,
                    Password = Crypto.HashPassword(password),
                    Email = email,
                    Type = type
                });

                db.SaveChanges();

                var customer = db.Customers
                    .FirstOrDefault(_customer =>
                        _customer.Name == username);

                if(customer != null &&
                    Crypto.VerifyHashedPassword(customer.Password, password))
                    return new JsonResult
                    {
                        Data = new
                        {
                            isValidCustomer = true,
                            id = customer.Id,
                            name = customer.Name,
                            email = customer.Email,
                            type = customer.Type,
                            address = customer.Address,
                            contactNumber = customer.ContactNumber,
                            imagePath = customer.Image
                        }
                    };
            }

            return new JsonResult
            {
                Data = new { isValidCustomer = false }
            };
		}

		public static JsonResult Login(Login data)
		{
			string username = data.Username;
            var password = data.Password;
            
            var customer = db.Customers
                .FirstOrDefault(_customer => _customer.Name == username);

            if (customer != null &&
                Crypto.VerifyHashedPassword(customer.Password, password))
                return new JsonResult
                {
                    Data = new
                    {
                        isValidCustomer = true,
                        id = customer.Id,
                        name = customer.Name,
                        email = customer.Email,
                        type = customer.Type,
                        address = customer.Address,
                        contactNumber = customer.ContactNumber,
                        imagePath = customer.Image
                    }
                };
            
            return new JsonResult
            {
                Data = new { isValidCustomer = false }
            };
		}
	}
}