using backend.Entities;

namespace backend.Data
{
    public static class AppData
    {
        static private string ConnectionString = string.Empty;
        static private string RpcServerUrl = string.Empty;
        static private string Secret = string.Empty;
        static private EmailConfiguration? EmailConfiguration;
        static private readonly string KeyStoreDir = "./keystore";
        public static void SetSettings(AppSettings settings)
        {

            ConnectionString = settings.ConnectionString;
            RpcServerUrl = settings.RpcServerUrl;
            Secret = settings.Secret;   
            EmailConfiguration = settings.EmailConfiguration;
        }

        public static string GetConnectionString()
        {
            return ConnectionString;
        }

        public static string GetRpcServerUrl() { 
            return RpcServerUrl;
        }

        public static string GetSecret()
        {
            return Secret;
        }

        public static string GetKeyStoreDir() {
            return KeyStoreDir;
        }

        public static EmailConfiguration GetEmailConfiguration()
        {
            return EmailConfiguration;
        }
    }


}
