//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Master_Food.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Menu
    {
        public int Id { get; set; }
        public int RestaurantId { get; set; }
        public int FoodItemId { get; set; }
        public int Stock { get; set; }
    
        public virtual FoodItem FoodItem { get; set; }
        public virtual Restaurant Restaurant { get; set; }
    }
}
