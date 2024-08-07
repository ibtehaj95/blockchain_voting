using backend.Entities;

namespace backend.DTO
{
    public class UserDTO : BaseUser
    {
        public string JwtToken { get; set; } = string.Empty;
    }
}
