using Microsoft.EntityFrameworkCore;

namespace FC_API.Models
{
    public class FoodCode
    {
       
        public int ID { get; set; }
        public int VENDOR_ID { get; set; }
        public int CATAGORY_ID { get; set; }
        public string FOOD_CODE { get; set; }

    }

}
