using FC_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UID == loginDto.UID);

            // Check user existence and password match
            if (user == null || user.Password != loginDto.Password)
                return Unauthorized("Invalid credentials");

            // Generate JWT
            var token = GenerateJwtToken(user);
            return Ok(new { token, name = user.Name, userType = user.USER_TYPE, uid = user.UID });

        }
        catch (Exception ex)
        {

            return null;
        }
        // Fetch user by UID
       
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] SignUpDto signUpDto)
    {
        // Check if user with the same UID already exists
        if (await _context.Users.AnyAsync(u => u.UID == signUpDto.UID))
            return Conflict("User with this UID already exists");

        // Create a new user
        var newUser = new User
        {
            UID = signUpDto.UID,
            Password = signUpDto.Password, // You might want to hash the password before saving it
            Name = signUpDto.Name, // Set the user's name
            USER_TYPE = signUpDto.USER_TYPE // Set the user's role
        };

        // Add user to the database
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        // Generate JWT for the newly signed up user
        var token = GenerateJwtToken(newUser);
        return Ok(new { token });
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UID),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, user.USER_TYPE) // Include role in the claims
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(60),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpGet("countUsers")]
    public async Task<IActionResult> CountUsers()
    {
        try
        {
            var userType = "User"; // Define the user type you want to count
            var userCount = await _context.Users.CountAsync(u => u.USER_TYPE == userType);
            return Ok(new { count = userCount });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsersByType()
    {
        try
        {
            var userType = "User"; // Define the user type you want to retrieve
            var users = await _context.Users
                                      .Where(u => u.USER_TYPE == userType)
                                      .Select(u => new UserDto
                                      {
                                          UID = u.UID,
                                          Name = u.Name
                                      })
                                      .ToListAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

}

public class LoginDto
{
    public string UID { get; set; }
    public string Password { get; set; }
}

public class SignUpDto
{
    public string UID { get; set; }
    public string Password { get; set; }
    public string Name { get; set; }
    public string USER_TYPE { get; set; } // Add role to the signup DTO
}

public class UserDto
{
    public string UID { get; set; }
    public string Name { get; set; }
}
