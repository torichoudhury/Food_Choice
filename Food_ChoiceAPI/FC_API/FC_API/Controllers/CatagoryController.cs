using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using FC_API.Models;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories.ToListAsync();
        return Ok(categories);
    }

    [HttpGet("{C_ID}")]
    public async Task<IActionResult> GetCategory(int C_ID)
    {
        var category = await _context.Categories.FindAsync(C_ID);

        if (category == null)
        {
            return NotFound();
        }

        return Ok(category);
    }
}
