namespace backend.Entities
{
    public class AppSettings
    {
        public string? ConnectionString { get; set; }
        public string? RpcServerUrl { get; set; }
        public string? Secret { get; set; }

        public EmailConfiguration? EmailConfiguration { get; set; }
    }
        

}
