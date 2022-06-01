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
	public class OrderDetail
	{
		public int id { get; set; }
		public string orderedDate { get; set; }
		public string productName { get; set; }
		public decimal? productPrice { get; set; }
		public string status { get; set; }
	}

	public class Dashboard
	{
		private readonly MasterFoodEntities db = new MasterFoodEntities();

		public JsonResult EditProfile(Profile profile)
		{
			var customer = db.Customers
				.Where(_customer => _customer.Id == profile.Id)
				.FirstOrDefault();

			if (customer == null)
				return new JsonResult
				{
					Data = new { isEdited = false }
				};

			bool isNameTaken = db.Customers
				.Where(_customer => _customer.Name == profile.Name && _customer.Id != customer.Id)
				.Count() > 0;

			if (isNameTaken)
				return new JsonResult
				{
					Data = new { isEdited = false }
				};

			if (profile.Name != null)
				customer.Name = profile.Name;
			if (profile.Password != null)
				customer.Password = Crypto.HashPassword(profile.Password);
			if (profile.Email != null)
				customer.Email = profile.Email;
			if (profile.Address != null)
				customer.Address = profile.Address;
			if (profile.BankAccNo != null)
				customer.BankAccNo = profile.BankAccNo;
			if (profile.ContactNumber != 0)
				customer.ContactNumber = profile.ContactNumber;
			if (profile.ImagePath != null)
				customer.Image = profile.ImagePath;
			if (profile.Image != null)
			{
				string base64 = profile.Image.Substring(profile.Image.IndexOf(',') + 1);
				byte[] imageAsBytes = Convert.FromBase64String(base64);
				string filePath = Path.Combine(HostingEnvironment.MapPath($"~/Images/Customers/"), profile.ImagePath);
				File.WriteAllBytes(filePath, imageAsBytes);
			}

			db.SaveChanges();
			return new JsonResult
			{
				Data = new
				{
					isEdited = true,
					id = profile.Id,
					name = customer.Name,
					email = customer.Email,
					type = customer.Type,
					address = customer.Address,
					contactNumber = customer.ContactNumber,
					imagePath = customer.Image
				}
			};
		}

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
			long contactNumber = customer.ContactNumber ?? 0;

			return new JsonResult
			{
				Data = new { id, name, email, imagePath, type, address, contactNumber }
			};
		}

		public JsonResult GetOrders(int id)
		{
			var orders = db.Orders.ToList();

			var res = new JsonResult();
			res.JsonRequestBehavior = JsonRequestBehavior.AllowGet;

			var odrs = new List<Dictionary<string, string>>();

			decimal totalMoneySpent = 0;
			foreach (var order in orders)
			{
				var foodItem = db.FoodItems
					.Where(_foodItem => _foodItem.Id == order.FoodItemId)
					.FirstOrDefault();

				if (order.Status == "completed")
					totalMoneySpent += Math.Round(foodItem.Price);

				odrs.Add(new Dictionary<string, string>
				{
					["id"] = order.Id.ToString(),
					["orderedDate"] = order.OrderedDate.ToString("dd/MM/yyyy"),
					["productName"] = foodItem.Name,
					["productPrice"] = foodItem.Price.ToString("N0"),
					["status"] = order.Status,
				});
			}

			DateTime latestOrderDate = orders
				.Select(odr => odr.OrderedDate)
				.Max(dt => dt);

			res.Data = new {
				orders = odrs,
				latestOrderDate = latestOrderDate.ToString("dd MMMM, yyyy"),
				totalMoneySpent = totalMoneySpent.ToString("N0")
			};

			return res;
		}

		public JsonResult GetFoodItems()
		{
			var foodItems = db.FoodItems;

			return new JsonResult
			{
				JsonRequestBehavior = JsonRequestBehavior.AllowGet,
				Data = new
				{
					foodItems = foodItems.Select(x => new
					{
						id = x.Id,
						rating = x.Rating,
						price = x.Price,
						name = x.Name,
						discount = x.Discount,
						type = x.Type,
						image = x.Image
					}).ToList()
				}
			};
		}

		public JsonResult EditOrderDetails(List<OrderDetail> datas)
		{
			foreach (var data in datas)
			{
				var order = db.Orders
					.Where(_order => _order.Id == data.id)
					.FirstOrDefault();

				if (data.orderedDate != null)
					order.OrderedDate = DateTime
						.ParseExact(data.orderedDate, "dd-MM-yyyy", null);
				if (data.productName != null)
				{
					var foodItem = db.FoodItems
					.Where(fooditem => fooditem.Name == data.productName)
					.FirstOrDefault();

					if(foodItem != null)
						order.FoodItemId = foodItem.Id;
				}
				if (data.productPrice != null)
				{
					var foodItem = db.FoodItems
					.Where(fooditem => fooditem.Id == order.FoodItemId)
					.FirstOrDefault();

					foodItem.Price = (decimal)data.productPrice;
				}
				if (data.status != null)
					order.Status = data.status;
			}

			db.SaveChanges();
			
			return new JsonResult
			{
				JsonRequestBehavior = JsonRequestBehavior.AllowGet,
				Data = new
				{
					isEdited = true
				}
			};
		}
	}
}