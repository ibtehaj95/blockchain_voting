using backend.Data;
using backend.DTO;
using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static backend.Entities.Enums;

namespace backend.Controllers
{
    public class AuthenticationController : BaseApiController
    {
        private IEmailSender _emailSender;
        public AuthenticationController(IEmailSender emailSender) { 
            _emailSender = emailSender;
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login([FromBody] LoginDTO loginDTO)
        {
            DataProviderTimer dp = null;
            string errorMessage = string.Empty;

            try
            {
                dp = new DataProviderTimer();
                UserDAO userDao = new UserDAO();
                User user = await userDao.GetUser(loginDTO.Email, dp);

                errorMessage = "User/Password combination not found.";
                if (user == null)
                    return Unauthorized(errorMessage);

                var hashed = loginDTO.Password;

                if(!BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.PasswordHash))
                    return Unauthorized(errorMessage);

                UserDTO userDTO = new UserDTO
                {
                    Email = user.Email,
                    Forename = user.Forename,
                    Surname = user.Surname,
                    IsAdmin = user.IsAdmin,
                    JwtToken = CreateJWT(user.Id)
                };

                return Ok(userDTO);
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, errorMessage);
            }
            finally
            {
                if (dp != null) await dp.SqlCloseConnectionAsync();
            }
            

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO userToRegister)
        {
            DataProviderTimer dp = null;
            string errorMessage = string.Empty;

            try
            {
                dp = new DataProviderTimer();
                UserDAO userDAO = new UserDAO();
                User user = await userDAO.GetUser(userToRegister.Email, dp);
                if (user != null)
                    return StatusCode(StatusCodes.Status409Conflict, "User already exists!");
                else
                {
                    string validationLink = Guid.NewGuid().ToString();
                    dp.SqlBeginTransaction();
                    DbReturn eRet = await userDAO.InsertUser(userToRegister, dp, validationLink);
                    dp.SqlCommitTransaction();

                    if (eRet == DbReturn.Error)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong. User could not be registered");
                    }               
                    else
                    {

                        Message message = new Message($"{userToRegister.Forename} {userToRegister.Surname}", userToRegister.Email,"Activation Link", validationLink);
                        _emailSender.SendEmail(message);
                        return Ok("User registered successfully");
                    }
                        
                }
            }
            catch (Exception ex)
            {
                if(dp != null)
                    dp.SqlRollbackTransaction();

                errorMessage = ex.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, errorMessage);
            }
            finally
            {
                if (dp != null) await dp.SqlCloseConnectionAsync();
            }
        }

       private string CreateJWT(string userId)
        {
            List<Claim> claims = new List<Claim>() { 
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, "Standard")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppData.GetSecret()));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddDays(1), signingCredentials: cred);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }


}
