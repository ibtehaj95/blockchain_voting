using backend.Entities;

namespace backend.DTO
{
    public class RegisterDTO : BaseUser
    {
        public string Password { get; set; }   = string.Empty;
    }
}
