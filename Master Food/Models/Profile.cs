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
	public class Profile
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Password { get; set; }
		public string Email { get; set; }
		public string Type { get; set; }
		public string Address { get; set; }
		public string BankAccNo { get; set; }
		public string ImagePath { get; set; }
		public string Image { get; set; }
		public long ContactNumber { get; set; }
	}
}