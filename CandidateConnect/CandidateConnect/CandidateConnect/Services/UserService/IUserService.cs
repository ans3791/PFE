using CandidateConnect.Models;

namespace CandidateConnect.Services.UserService
{
    public interface IUserService
    {
        Task CreateAccountAsync(UserModel user, IFormFile cvFile);
        Task<UserModel> LoginAsync(string email, string password);
        Task<UserModel> ProfileAsync(int id);
        Task<byte[]> DownloadCv(int userId);
    }
}
