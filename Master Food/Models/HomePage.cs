using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

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
	}
}