using CandidateConnect.Database;
using CandidateConnect.Database.Models;
using CandidateConnect.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace CandidateConnect.Services.UserService
{
    public class UserService(DatabaseContext database) : IUserService
    {
        public async Task CreateAccountAsync(UserModel user, IFormFile cvFile)
        {
            if (cvFile != null)
            {
                var filePath = Path.Combine("Files",
                    "CVs", cvFile.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await cvFile.CopyToAsync(stream);
                }
                user.CvFilename = cvFile.FileName;
            }

            // Check if email already exists
            bool alreadyExist = await database.Users.AnyAsync(u => u.Email == user.Email);
            if (alreadyExist)
            {
                throw new Exception("emailExist");
            }

            User newUser = new()
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                PasswordHash = HashPassword(user.Password),
                Summary = user.Summary,
                Title = user.Title,
                TechnicalSkills = user.TechnicalSkills,
                Location = user.Location,
                Experience = user.Experience,
                CvFilename = user.CvFilename,
                SignInDate = DateTime.Now.ToUniversalTime(),
                Type = UserType.Applicant
            };

            await database.Users.AddAsync(newUser);
            await database.SaveChangesAsync();
        }

        public async Task<UserModel> LoginAsync(string email, string password)
        {
            var user = await database.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || HashPassword(password) != user.PasswordHash)
            {
                throw new Exception("loginError");
            }
            return new()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Summary = user.Summary,
                Title = user.Title,
                TechnicalSkills = user.TechnicalSkills,
                Location = user.Location,
                Experience = user.Experience,
                CvFilename = user.CvFilename,
                SignInDate = user.SignInDate,
                Type = user.Type
            };
        }

        public async Task<UserModel> ProfileAsync(int id)
        {
            var user = await database.Users
                .Include(u => u.Offers).ThenInclude(o => o.Job)
                .FirstOrDefaultAsync(u => u.Id == id);
            return new()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Summary = user.Summary,
                Title = user.Title,
                TechnicalSkills = user.TechnicalSkills,
                Location = user.Location,
                Experience = user.Experience,
                CvFilename = user.CvFilename,
                SignInDate = user.SignInDate,
                Offers = user.Offers.Select(o => new JobOfferUserModel()
                {
                    Title = o.Job.Title,
                    Description = o.Job.Description,
                    Status = o.Status,
                    DateApplication = o.DateApplication,
                }).ToList()
            };
        }

        public static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = SHA256.HashData(bytes);
            return Convert.ToBase64String(hash);
        }

        public async Task<byte[]> DownloadCv(int userId)
        {
            var user = await database.Users.FirstOrDefaultAsync(u => u.Id == userId);

            var filePath = Path.Combine("Files", "CVs", user.CvFilename);

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException("CV file not found.", filePath);
            }

            return await File.ReadAllBytesAsync(filePath);
        }
    }
}