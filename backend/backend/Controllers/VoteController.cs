using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    public class VoteController : BaseApiController
    {
        public VoteController() { }


        //[HttpPost]
        //public Task<IActionResult> CreateVoteProcedure([FromBody] object voteProcedureDTO ) { 
        
        
        //}
    }
}
