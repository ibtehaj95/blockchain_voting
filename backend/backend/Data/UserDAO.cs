using backend.DTO;
using backend.Entities;
using Microsoft.Data.SqlClient;
using System.Data;
using static backend.Entities.Enums;

namespace backend.Data
{
    public class UserDAO : DAOBase
    {

        public UserDAO() { }

        public async Task<User> GetUser(string email, DataProviderTimer dp) {
     
            SqlDataReader? reader = null;      
            try
            {
                string sqlStmt = string.Format("SELECT * FROM [User] WHERE [Email]='{0}'", email);
                reader = await dp.GetDataAsync(sqlStmt);
                DataTable dtUser = new();
                dtUser.Load(reader);
                User user = null;


                foreach(DataRow row in dtUser.Rows)
                {
                    user = new User();
                    user.Id = NVString(row["Uid"]);
                    user.Forename = NVString(row["Forename"]);
                    user.Surname = NVString(row["Surname"]);
                    user.IsAdmin = NVBoolean(row["IsAdmin"]);
                    user.Email = NVString(row["Email"]);
                    user.PasswordHash = NVString(row["PasswordHash"]);
                }

                return user;

            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                if(reader != null) 
                    await reader.CloseAsync();
            }  
        }

        public async Task<DbReturn> InsertUser(RegisterDTO registerDTO, DataProviderTimer dp, string validationLink )
        {
            

            try
            {
                string uid = Guid.NewGuid().ToString();
                DateTime validationLinkExpiry = DateTime.Now.AddMinutes(20);

                string sqlStmt = string.Format("INSERT INTO [User] " +
                    "(" +
                    "[UID]," +
                    "[Forename], " +
                    "[Surname], " +
                    "[Email], " +
                    "[PasswordHash], " +
                    "[IsAdmin], " +
                    "[validationLink]," +
                    "[validationLinkExpiry]" +
                    ")" +
                    "VALUES ('{0}', '{1}', '{2}', '{3}','{4}', {5}, '{6}', '{7}')", 
                    uid, registerDTO.Forename, registerDTO.Surname, registerDTO.Email, BCrypt.Net.BCrypt.HashPassword(registerDTO.Password), Convert.ToInt32(registerDTO.IsAdmin), validationLink, validationLinkExpiry);

                int nRet =  await dp.ExecuteNonQueryAsync(sqlStmt);
                DbReturn eRet = DbReturn.OK;
                if(nRet == 0 )
                    eRet = DbReturn.Error;

                return eRet;

            }
            catch(Exception ex) 
            {
                throw;
            }
        }
    }
}
