using Microsoft.EntityFrameworkCore;

namespace FC_API.Models
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<FoodCode> FoodCodes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<ChartUploadMaster> ChartUploadMasters { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>()
                .ToTable("F_ORDER")
                .HasKey(o => o.ORDER_ID);

            modelBuilder.Entity<User>()
                .ToTable("USERS")
                .HasKey(u => u.UID);

            modelBuilder.Entity<Vendor>()
                .ToTable("VENDOR_TABLE")
                .HasKey(v => v.V_ID);

            modelBuilder.Entity<Category>()
                .ToTable("CATAGORY_TABLE")
                .HasKey(v => v.C_ID);

            modelBuilder.Entity<FoodCode>()
                .ToTable("F_MENU_CODE_MASTER")
                .HasKey(v => v.ID);

            modelBuilder.Entity<ChartUploadMaster>()
                .ToTable("CHART_UPLOAD_MASTER")
                .HasKey(c => c.CHART_ID);
        }
    }
}
