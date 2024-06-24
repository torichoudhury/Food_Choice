using System;
using System.Text.Json.Serialization;

namespace FC_API.Models
{
    public class Order
    {
        public int ORDER_ID { get; set; }
        public string UID { get; set; }
        public int V_ID { get; set; }
        public int C_ID { get; set; }
        public int F_MENU_ID { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime ORDER_DATE { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime CREATED_DATE { get; set; }

        public int ORDER_STATUS { get; set; }

    }
    public class OrderDetailsDTO
    {
        public string UID { get; set; }
        public int OrderID { get; set; }
        public int V_ID { get; set; }
        public string V_NAME { get; set; }
       
        public int C_ID { get; set; }
        public string CATA_NAME { get; set; }
        public int ID { get; set; }
        public int F_MENU_ID { get; set; }
        public string FOOD_CODE { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime ORDER_DATE { get; set; }
        public int ORDER_STATUS { get; set; }

    }
}
