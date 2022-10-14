using ASP.NET_CORE.Database;
using ASP.NET_CORE.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ASP.NET_CORE.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("/api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeManagementDbContext _userManagementDbContext;

        public EmployeesController(EmployeeManagementDbContext userManagementDbContext)
        {
            _userManagementDbContext = userManagementDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManagementDbContext.Employees.ToListAsync();

            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> AddUsers([FromBody] Employee employeeRequest)
        {
            employeeRequest.Id = Guid.NewGuid();
            await _userManagementDbContext.Employees.AddAsync(employeeRequest);
            await _userManagementDbContext.SaveChangesAsync();

            return Ok(employeeRequest);
        }
    }
}
