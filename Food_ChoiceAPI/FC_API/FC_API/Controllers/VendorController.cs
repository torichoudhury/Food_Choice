using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using FC_API.Models;

[ApiController]
[Route("api/[controller]")]
public class VendorController : ControllerBase
{
    private readonly AppDbContext _context;

    public VendorController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vendor>>> GetVendors()
    {
        var vendors = await _context.Vendors.ToListAsync();
        return Ok(vendors);
    }

    [HttpGet("{V_ID}")]
    public async Task<IActionResult> GetVendor(int V_ID)
    {
        var vendor = await _context.Vendors.FindAsync(V_ID);

        if (vendor == null)
        {
            return NotFound();
        }

        return Ok(vendor);
    }
}
