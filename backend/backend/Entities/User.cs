namespace backend.Entities
{
    public class User : BaseUser
    {
        public string Id { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;  
    }
}
