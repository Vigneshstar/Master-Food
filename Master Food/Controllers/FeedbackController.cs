using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Master_Food.Models;

namespace Master_Food.Controllers
{
    public class FeedbackController : Controller
    {
        private FeedbackPage feedbackModel = new FeedbackPage();

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
		public ActionResult AcceptFeedback(FeedbackPage.UserFeedback data)
		{
			return feedbackModel.AcceptFeedback(data);
        }
	}
}