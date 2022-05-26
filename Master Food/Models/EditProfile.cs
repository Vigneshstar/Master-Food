using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Hosting;
using System.Web.Mvc;

namespace Master_Food.Models
{
	public class EditProfile
	{
		private MasterFoodEntities db = new MasterFoodEntities();
		public int Id { get; set; }
		public string Name { get; set; }
		public string Password { get; set; }
		public string Email { get; set; }
		public string Type { get; set; }
		public string Address { get; set; }
		public string BankAccNo { get; set; }
		public string ImagePath { get; set; }
		public string Image { get; set; }

		public JsonResult UpdateDetails()
		{
			var customer = db.Customers
				.Where(_customer => _customer.Id == Id)
				.FirstOrDefault();

			if (customer == null)
				return new JsonResult
				{
					Data = new { isEdited = false }
				};

			bool isNameTaken = db.Customers
				.Where(_customer => _customer.Name == Name && _customer.Id != customer.Id)
				.Count() > 0;

			if (isNameTaken)
				return new JsonResult
				{
					Data = new { isEdited = false }
				};

			if (Name != null)
				customer.Name = Name;
			if(Password != null)
				customer.Password = Crypto.HashPassword(Password);
			if (Email != null)
				customer.Email = Email;
			if (Address != null)
				customer.Address = Address;
			if (BankAccNo != null)
				customer.BankAccNo = BankAccNo;
			if (ImagePath != null)
				customer.Image = ImagePath;
			if (Image != null) {
				string base64 = Image.Substring(Image.IndexOf(',') + 1);
				Debug.WriteLine(base64);
				byte[] imageAsBytes = Convert.FromBase64String(base64);
				string filePath = Path.Combine(HostingEnvironment.MapPath($"~/Images/Customers/"), ImagePath);
				File.WriteAllBytes(filePath, imageAsBytes);
			}

			db.SaveChanges();
			return new JsonResult
			{
				Data = new
				{
					isEdited = true,
					id = Id,
					name = customer.Name,
					email = customer.Email,
					type = Type,
					address = customer.Address,
					imagePath = customer.Image
				}
			};
		}
	}
}