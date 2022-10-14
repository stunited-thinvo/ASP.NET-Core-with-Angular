using ASP.NET_CORE.Models;
using ASP.NET_CORE.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RestSharp;
using RestSharp.Authenticators;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ASP.NET_CORE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthenticationController(UserManager<IdentityUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationRequestDto requestDto)
        {
            if (ModelState.IsValid)
            {
                var user_exist = await _userManager.FindByEmailAsync(requestDto.Email);

                if (user_exist != null)
                {
                    return BadRequest(new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Email is already exist"
                        }
                    });
                }

                var new_user = new IdentityUser()
                {
                    Email = requestDto.Email,
                    UserName = requestDto.Email,
                    EmailConfirmed = false,
                };

                var is_created = await _userManager.CreateAsync(new_user, requestDto.Password);

                if (is_created.Succeeded)
                {
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(new_user);

                    var email_body = $"Please confirm your email <a href=\"#URL#\">Click here</a>";

                    var callback_url = Request.Scheme + "://" + Request.Host + Url.Action("ConfirmEmail", "Authentication", new { userId = new_user.Id, code = code });

                    var body = email_body.Replace("#URL#", System.Text.Encodings.Web.HtmlEncoder.Default.Encode(callback_url));

                    var result = SendEmail(body, new_user.Email);

                    if (result)
                        return Ok("Please verify your email");

                    return Ok("Please request verification email");
                    //var token = GenerateJwtToken(new_user);

                    //return Ok(new AuthResult()
                    //{
                    //    Result = true,
                    //    Token = token,
                    //});
                }

                return BadRequest(new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Server error"
                    },
                    Result = false
                });
            }

            return BadRequest();
        }

        [Route("ConfirmEmail")]
        [HttpGet]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return BadRequest(new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Invalid email"
                    },
                });
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest(new AuthResult()
                {
                    Errors = new List<string>()
                    {
                        "Ivalid params"
                    },
                });
            }

            code = Encoding.UTF8.GetString(Convert.FromBase64String(code));

            var result = await _userManager.ConfirmEmailAsync(user, code);

            var status = result.Succeeded ? "Thank you" : "Please try again";

            return Ok();
        }

        [Route("Login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] UserLoginRequestDto loginRequest)
        {
            if (ModelState.IsValid)
            {
                var existing_user = await _userManager.FindByEmailAsync(loginRequest.Email);

                if (existing_user == null)
                    return BadRequest(new AuthResult()
                    {
                        Errors = new List<string>()
                        {
                            "User is not exist"
                        },
                        Result = false
                    });

                if (!existing_user.EmailConfirmed)
                    return BadRequest(new AuthResult()
                    {
                        Errors = new List<string>()
                        {
                            "User is not confirmed"
                        },
                        Result = false
                    });

                var isCorrect = await _userManager.CheckPasswordAsync(existing_user, loginRequest.Password);

                if (!isCorrect)
                    return BadRequest(new AuthResult()
                    {
                        Errors = new List<string>()
                        {
                            "Wrong password"
                        },
                        Result = false
                    });

                var jwtToken = GenerateJwtToken(existing_user);

                return Ok(new AuthResult()
                {
                    Token = jwtToken,
                    Result = true
                });
            }

            return BadRequest(new AuthResult()
            {
                Errors = new List<string>()
                {
                    "Invalid payload"
                },
                Result = false
            });
        }
        private string GenerateJwtToken(IdentityUser user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtConfig:Secret").Value);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("Id", user.Id),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Email, value: user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString()),
                }),

                Expires = DateTime.Now.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256),
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        private bool SendEmail(string body, string email)
        {
            var client = new RestClient("https://api.mailgun.net/v3");

            var request = new RestRequest("", Method.Post);

            client.Authenticator = new HttpBasicAuthenticator("api", _configuration.GetSection("EmailConfig:API_KEY").Value);

            request.AddParameter("domain", "sandboxa18993f71c3248dd99e876edf24fd191.mailgun.org", ParameterType.UrlSegment);
            request.Resource = "{domain}/messages";
            request.AddParameter("from", "Mailgun Sandbox <postmaster@sandboxa18993f71c3248dd99e876edf24fd191.mailgun.org>");
            request.AddParameter("to", "thin.vo@stunited.vn");
            request.AddParameter("subject", "Email verification");
            request.AddParameter("text", body);
            request.Method = Method.Post;

            var response = client.Execute(request);

            return response.IsSuccessful;
        }
    }
}
