using CandidateConnect.Models;
using CandidateConnect.Services.UserService;
using Microsoft.AspNetCore.Mvc;

namespace CandidateConnect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(IUserService userService) : ControllerBase
    {
        [HttpPost("create-account")]
        public async Task<IActionResult> CreateAccountAsync([FromForm] UserModel user, IFormFile cvFile)
        {
            await userService.CreateAccountAsync(user, cvFile);
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] UserModel user)
        {
            return Ok(await userService.LoginAsync(user.Email, user.Password));
        }

        [HttpGet("profile/{id}")]
        public async Task<IActionResult> ProfileAsync(int id)
        {
            return Ok(await userService.ProfileAsync(id));
        }

        [HttpPost("cv/{userId}")]
        public async Task<IActionResult> DownloadCvAsync(int userId)
        {
            var pdf = await userService.DownloadCv(userId);
            return File(pdf, "application/pdf", "cv.pdf");
        }
    }
}
