using backend.Data;
using Nethereum.Signer;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using Nethereum.Hex.HexConvertors.Extensions;
using Nethereum.KeyStore.Model;
using Nethereum.KeyStore;
using backend.DTO;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Security.Cryptography;
using System.Text;
using System.Reflection;

namespace backend.Services
{
    public  class Web3Service
    {
        private static readonly ScryptParams scryptParams = new() { Dklen = 32, N = 262144, R = 1, P = 8 };
        private static readonly KeyStoreScryptService keyStoreService = new();
        private static readonly Web3 web3 = new(AppData.GetRpcServerUrl());
        public Web3Service()
        {
        }

        public async void CreateNewAccount(string userId)
        {
            
            try
            {
                EthECKey ecKey = EthECKey.GenerateKey();
                string privateKey = ecKey.GetPrivateKeyAsBytes().ToHex();
                Account account = new(privateKey);
                await web3.Personal.NewAccount.SendRequestAsync(account.Address);


                var filename = GetFilenameOfPrivateKey(userId);
                var keyStore = keyStoreService.EncryptAndGenerateKeyStore(AppData.GetSecret(), ecKey.GetPrivateKeyAsBytes(), ecKey.GetPublicAddress(), scryptParams);
                string keyStoreJson = keyStoreService.SerializeKeyStoreToJson(keyStore);

               
                string keyStorePath = $@"C:\blockchain\{filename}.txt";
                File.WriteAllText(keyStorePath, keyStoreJson);
                var json = File.ReadAllText(keyStorePath);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private static string GetFilenameOfPrivateKey(string userId)
        {
            var userIdAsBytes = Encoding.UTF8.GetBytes(userId);
            return Convert.ToBase64String(SHA256.Create().ComputeHash(userIdAsBytes)).Replace('/', '_');
        }

        private static byte[] GetPrivateKeyAsBytes(string userId) {
            var filename = GetFilenameOfPrivateKey(userId);
            string keyStorePath = $@"C:\blockchain\{filename}.txt";
            var json = File.ReadAllText(keyStorePath);
            return keyStoreService.DecryptKeyStoreFromJson(AppData.GetSecret(), json);
        }

        public void StartVoteCast(string userId)
        {

        }

        public void CastVote(string userId) {
            var privateKey = GetPrivateKeyAsBytes(userId).ToHex();
        }
      
    }
}
