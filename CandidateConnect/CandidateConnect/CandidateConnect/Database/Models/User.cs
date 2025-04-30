using CandidateConnect.Models;
using System.ComponentModel.DataAnnotations;

namespace CandidateConnect.Database.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string PasswordHash { get; set; }
        public string Summary { get; set; }
        public string Title { get; set; }
        public DateTime SignInDate { get; set; }
        public string TechnicalSkills { get; set; }
        public string Location { get; set; }
        public string Experience { get; set; }
        public string CvFilename { get; set; }
        public List<JobOfferUser> Offers { get; set; }
        public UserType Type { get; set; }
    }
}
