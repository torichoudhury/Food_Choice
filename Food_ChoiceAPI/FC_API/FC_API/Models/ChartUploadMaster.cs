using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FC_API.Models
{
    public class ChartUploadMaster
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CHART_ID { get; set; }

        [Required]
        public int VENDOR_ID { get; set; }

        [Required]
        public byte[] CHART_IMG { get; set; }

        [Required]
        public string ACTIVE_STATUS { get; set; }
    }
}
