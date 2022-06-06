using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Master_Food.Models
{
	public class FindFoodPage
	{
		private MasterFoodEntities db = new MasterFoodEntities();
		
		public List<KeyValuePair<string, List<FoodItem>>> GetFoodItems
		{
			get {
				var foodItems = db.FoodItems;
				var cusines = new List<KeyValuePair<string, List<FoodItem>>>();

				foreach (var cusineData in foodItems.GroupBy(x => x.Type))
					cusines.Add(
						new KeyValuePair<string, List<FoodItem>>(cusineData.Key, cusineData.ToList())
					);

				var displayOrders = new string[]
				{
					"breakfast", "lunch", "dinner", "dessert", "shake"
				};

				var sortedCusines = new List<KeyValuePair<string, List<FoodItem>>>();

				foreach (var category in displayOrders)
					sortedCusines.Add(
						new KeyValuePair<string, List<FoodItem>>(
							category,
							cusines.Find(x => x.Key == category).Value
						)
					);

				return sortedCusines;
			}
		}

		public List<Restaurant> Restaurants { get => db.Restaurants.ToList(); }

		public List<FoodItem> GetDiscountItems {
			get {
				var discountItems = db.FoodItems
					.Where(x => x.Discount != 0)
					.ToList();

				return discountItems;
			}
		}

		public class FoodOrders
		{
			public int CustomerId { get; set; }
			public int FoodItemId { get; set; }
			public int RestaurantId { get; set; }
			public int Quantity { get; set; }
		}

		public JsonResult AcceptOrders(List<FoodOrders> orders)
		{
			foreach(var order in orders)
				db.Orders.Add(new Order
				{
					CustomerId = order.CustomerId,
					FoodItemId = order.FoodItemId,
					Quantity = order.Quantity,
					RestaurantId = order.RestaurantId,
					Status = "pending",
					OrderedDate = DateTime.Now
				});

			db.SaveChanges();
			return new JsonResult
			{
				Data = new { isAdded = true },
			};
		}
	}
}