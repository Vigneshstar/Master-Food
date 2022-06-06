using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Master_Food.Models
{
	public class FeedbackPage
	{
		private MasterFoodEntities db = new MasterFoodEntities();

		public class UserFeedback
		{
			public int CustomerId { get; set; }
			public string Comment { get; set; }
			public byte Rating { get; set; }
		}

		public JsonResult AcceptFeedback(UserFeedback feedback)
		{
			db.ServiceFeedbacks.Add(new ServiceFeedback
			{
				CustomerId = feedback.CustomerId,
				Comment = feedback.Comment,
				Rating = feedback.Rating,
				UploadDateTime = DateTime.Now,
			});

			db.SaveChanges();

			return new JsonResult
			{
				Data = new
				{
					isAdded = true
				}
			};
		}
	}
}