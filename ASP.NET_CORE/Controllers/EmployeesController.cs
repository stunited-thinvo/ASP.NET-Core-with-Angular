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

        [HttpGet, Authorize(Roles = "Admin")]
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

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> Details(Guid id)
        {
            var employee = await _userManagementDbContext.Employees.FirstOrDefaultAsync(x => x.Id == id);

            if (employee == null)
            {
                return NotFound();
            };

            return Ok(employee);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateUser([FromRoute] Guid id, Employee employeeRequest)
        {
            var employee = await _userManagementDbContext.Employees.FirstOrDefaultAsync(x => x.Id == id);

            if (employee == null)
            {
                return NotFound();
            };

            employee.Name = employeeRequest.Name;
            employee.Email = employeeRequest.Email;
            employee.Phone = employeeRequest.Phone;
            employee.Address = employeeRequest.Address;

            await _userManagementDbContext.SaveChangesAsync();

            return Ok("Update successfully");
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteUsers(Guid id)
        {
            var employee = await _userManagementDbContext.Employees.FirstOrDefaultAsync(x => x.Id == id);

            if (employee == null)
            {
                return BadRequest();
            }

            _userManagementDbContext.Employees.Remove(employee);
            await _userManagementDbContext.SaveChangesAsync();

            return Ok("Delete successfully");
        }
    }
}