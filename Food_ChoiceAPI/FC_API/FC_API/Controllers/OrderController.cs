using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using FC_API.Models;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace FC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("AddOrder")]
        public async Task<IActionResult> AddOrder([FromBody] List<Order> orderlist)
        {
            if (orderlist == null)
            {
                return BadRequest("Order list is null.");
            }

            // Extract the unique ORDER_DATE and UID pairs from the incoming orders
            var orderDatesAndUids = orderlist
                .Select(o => new { o.ORDER_DATE, o.UID })
                .Distinct()
                .ToList();

            // Retrieve existing orders from the database that match the ORDER_DATE and UID pairs
            var existingOrders = await _context.Orders
                .Where(o => orderDatesAndUids
                    .Select(ou => ou.ORDER_DATE)
                    .Contains(o.ORDER_DATE) &&
                    orderDatesAndUids
                    .Select(ou => ou.UID)
                    .Contains(o.UID))
                .ToListAsync();

            // Check if any of the existing orders match the incoming orders
            var duplicateOrders = orderlist
                .Where(o => existingOrders
                    .Any(eo => eo.ORDER_DATE == o.ORDER_DATE && eo.UID == o.UID))
                .ToList();

            if (duplicateOrders.Any())
            {
                return BadRequest("One or more orders with the same ORDER_DATE and UID already exist.");
            }
            List<Order> drderdetails = new List<Order>();

            foreach (var _order in orderlist)
            {
                Order order = new Order();
                order.UID = _order.UID;
                order.V_ID = _order.V_ID;
                order.C_ID = _order.C_ID;
                order.F_MENU_ID = _order.F_MENU_ID;
                order.ORDER_DATE = _order.ORDER_DATE;
                order.CREATED_DATE = _order.CREATED_DATE;
                order.ORDER_STATUS = 1;

                drderdetails.Add(order);

            }

            await _context.Orders.AddRangeAsync(drderdetails);
            await _context.SaveChangesAsync();
            return Ok(orderlist);
        }

        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .ToListAsync();

            if (orders == null || orders.Count == 0)
            {
                return NotFound();
            }

            return Ok(orders);
        }

        [HttpGet("{uid}")]
        public async Task<IActionResult> GetOrder(string uid)
        {
            var orders = await _context.Orders
                .Where(o => o.UID == uid)
                .ToListAsync();

            if (orders == null || orders.Count == 0)
            {
                return NotFound();
            }

            return Ok(orders);
        }


        [HttpGet("GetActiveOrders")]
        public async Task<IActionResult> GetActiveOrders()
        {
            var orders = await _context.Orders
                .Where(o => o.ORDER_STATUS == 1)
                .ToListAsync();

            if (orders == null || orders.Count == 0)
            {
                return NotFound();
            }

            return Ok(orders);
        }

        [HttpGet("GetOrderDetails")]
        public async Task<IActionResult> GetOrderDetails()
        {
            var orderDetails = await (from o in _context.Orders
                                      join v in _context.Vendors on o.V_ID equals v.V_ID
                                      join c in _context.Categories on o.C_ID equals c.C_ID
                                      join f in _context.FoodCodes on o.F_MENU_ID equals f.ID
                                      select new OrderDetailsDTO
                                      {
                                          OrderID = o.ORDER_ID,
                                          UID = o.UID,
                                          V_ID = v.V_ID,
                                          V_NAME = v.V_NAME,
                                          CATA_NAME = c.CATA_NAME,
                                          FOOD_CODE = f.FOOD_CODE,
                                          ORDER_DATE = o.ORDER_DATE,
                                          ORDER_STATUS = o.ORDER_STATUS

                                      }).ToListAsync();

            if (orderDetails == null || orderDetails.Count == 0)
            {
                return NotFound();
            }

            return Ok(orderDetails);
        }


       // [HttpGet("{UID1}")]
        [HttpGet("GetOrderDetailsByID/{UID1}")]
        public async Task<IActionResult> GetOrderDetailsByID(string UID1)
        {
            var orderDetails = await (from o in _context.Orders
                                      join v in _context.Vendors on o.V_ID equals v.V_ID
                                      join c in _context.Categories on o.C_ID equals c.C_ID
                                      join f in _context.FoodCodes on o.F_MENU_ID equals f.ID
                                      select new OrderDetailsDTO
                                      {
                                          OrderID = o.ORDER_ID,
                                          UID = o.UID,
                                          V_ID = v.V_ID,
                                          V_NAME = v.V_NAME,
                                          CATA_NAME = c.CATA_NAME,
                                          FOOD_CODE = f.FOOD_CODE,
                                          ORDER_DATE = o.ORDER_DATE,
                                          ORDER_STATUS = o.ORDER_STATUS

                                      }).Where(p=>p.UID==UID1).ToListAsync();

            if (orderDetails == null || orderDetails.Count == 0)
            {
                return NotFound();
            }

            return Ok(orderDetails);
        }
        [HttpGet("GetOrderCounts")]
        public async Task<IActionResult> GetOrderCounts()
        {
            var vegOrderCount = await _context.Orders.CountAsync(o => o.C_ID == 1);
            var nonVegOrderCount = await _context.Orders.CountAsync(o => o.C_ID == 2);
           // var numberOfOrder = await _context.Orders.CountAsync(o.ORDER_ID);

            return Ok(new { VegOrderCount = vegOrderCount, NonVegOrderCount = nonVegOrderCount, });
        }

        [HttpPut("UpdateOrderStatus/{id}")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] int newStatus)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            order.ORDER_STATUS = newStatus;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}