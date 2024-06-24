using FC_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ImageUploadController : ControllerBase
{
    private readonly AppDbContext _context;

    public ImageUploadController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> UploadImage([FromBody] ImageUploadRequest request)
    {
        if (string.IsNullOrEmpty(request.ImageData))
            return BadRequest("No image data provided");

        if (request.VendorId <= 0)
            return BadRequest("Invalid VendorId");

        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                byte[] imageData = Convert.FromBase64String(request.ImageData);

                var existingRecords = await _context.ChartUploadMasters
                                                    .Where(c => c.VENDOR_ID == request.VendorId)
                                                    .ToListAsync();

                foreach (var record in existingRecords)
                {
                    record.ACTIVE_STATUS = "false";
                    _context.ChartUploadMasters.Update(record);
                }

                var chartUpload = new ChartUploadMaster
                {
                    VENDOR_ID = request.VendorId,
                    CHART_IMG = imageData,
                    ACTIVE_STATUS = "true"
                };

                _context.ChartUploadMasters.Add(chartUpload);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok("Successful");
            }
            catch (FormatException)
            {
                await transaction.RollbackAsync();
                return BadRequest("Invalid base64 string");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    [HttpGet("{chartId}/{vendorId}")]
    public async Task<IActionResult> GetImage(int chartId, int vendorId)
    {
        try
        {
            var chartUpload = await _context.ChartUploadMasters
                                            .Where(c => c.CHART_ID == chartId && c.VENDOR_ID == vendorId)
                                            .FirstOrDefaultAsync();

            if (chartUpload == null)
                return NotFound("Image not found");

            string base64Image = Convert.ToBase64String(chartUpload.CHART_IMG);
            return Ok(new { ChartId = chartId, VendorId = vendorId, Base64Image = base64Image });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveImages()
    {
        try
        {
            var activeImages = await _context.ChartUploadMasters
                                             .Where(c => c.ACTIVE_STATUS == "true")
                                             .Select(c => new
                                             {
                                                 ChartId = c.CHART_ID,
                                                 VendorId = c.VENDOR_ID,
                                                 Base64Image = Convert.ToBase64String(c.CHART_IMG),
                                                 ActiveStatus = c.ACTIVE_STATUS
                                             })
                                             .ToListAsync();

            return Ok(activeImages);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("active/vendor/{vendorId}")]
    public async Task<IActionResult> GetActiveImagesForVendor(int vendorId)
    {
        try
        {
            var activeImages = await _context.ChartUploadMasters
                                             .Where(c => c.VENDOR_ID == vendorId && c.ACTIVE_STATUS == "true")
                                             .Select(c => new
                                             {
                                                 Base64Image = Convert.ToBase64String(c.CHART_IMG),
                                             })
                                             .ToListAsync();

            return Ok(activeImages);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

}




namespace FC_API.Models
{
    public class ImageUploadRequest
    {
        public int VendorId { get; set; }
        public string ImageData { get; set; }
    }
}
