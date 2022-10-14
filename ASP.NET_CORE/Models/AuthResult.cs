namespace ASP.NET_CORE.Models
{
    public class AuthResult
    {
        public string Token { get; set; }
        public bool Result { get; set; }
        public string Errors { get; set; }
    }
}
