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
    
    public partial class FavouriteFoodItem
    {
        public int Id { get; set; }
        public int FoodItemId { get; set; }
        public int CustomerId { get; set; }
        public int TotalOrders { get; set; }
    
        public virtual Customer Customer { get; set; }
        public virtual FoodItem FoodItem { get; set; }
    }
}
