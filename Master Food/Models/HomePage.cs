using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Web.Mvc;

namespace Master_Food.Models
{
	public class HomePage
	{
		private MasterFoodEntities db = new MasterFoodEntities();
		public List<Restaurant> Restaurants
		{
			get => db.Restaurants.ToList() ?? default(List<Restaurant>);
		}

		public List<TodaysTopCusine> TodaysTopCusines
		{
			get => db.TodaysTopCusines.ToList() ?? default(List<TodaysTopCusine>);
		}

		public List<ServiceFeedback> Feedbacks
		{
			get => db.ServiceFeedbacks.Include(r => r.Customer).Distinct().OrderBy(r => Guid.NewGuid()).Take(4).ToList() ?? default(List<ServiceFeedback>);
		}

		public class FavFoodItem
		{
			public int foodId { get; set; }
			public int customerId { get; set; }
		}

		public ActionResult AddToFavFoods(FavFoodItem data)
		{
			var addedFavFood = db.FavouriteFoodItems.Add(new FavouriteFoodItem
			{
				FoodItemId = data.foodId,
				CustomerId = data.customerId,
				TotalOrders = db.Orders.Count(order =>
					order.FoodItemId == data.foodId && order.CustomerId == data.customerId)
			});

			db.SaveChanges();

			return new JsonResult
			{
				Data = new { favFoodId = addedFavFood.Id }
			};
		}

		public ActionResult RemoveFromFavFoods(int id)
		{
			var foodItem = db.FavouriteFoodItems.Find(id);
			db.FavouriteFoodItems.Remove(foodItem);

			db.SaveChanges();
			return new EmptyResult();
		}
	}
}