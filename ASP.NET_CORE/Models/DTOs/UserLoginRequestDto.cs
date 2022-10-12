using System.ComponentModel.DataAnnotations;

namespace ASP.NET_CORE.Models.DTOs
{
    public class UserLoginRequestDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
