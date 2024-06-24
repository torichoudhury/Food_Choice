using System.ComponentModel.DataAnnotations;

namespace FC_API.Models
{
    public class User
    {
        [Key]
        [Required]
        public string UID { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string USER_TYPE { get; set; } // Admin or User
    }
}
