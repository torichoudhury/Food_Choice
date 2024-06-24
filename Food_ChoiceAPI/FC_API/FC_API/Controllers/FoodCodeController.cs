using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FC_API.Models;

namespace FC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FoodController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetFoodCodes")]
        public async Task<IActionResult> GetFoodCodes(int vendorId, int categoryId)
        {
            var foodCodes = await _context.FoodCodes
                .Where(f => f.VENDOR_ID == vendorId && f.CATAGORY_ID == categoryId)
                .Select(f => new { f.FOOD_CODE, f.ID})
                .ToListAsync();

            if (foodCodes == null || foodCodes.Count == 0)
            {
                return NotFound("No food codes found for the given vendor and category.");
            }

            return Ok(foodCodes);
        }
    }
}
