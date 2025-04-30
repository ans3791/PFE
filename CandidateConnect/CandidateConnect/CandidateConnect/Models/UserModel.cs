using CandidateConnect.Database.Models;

namespace CandidateConnect.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string Summary { get; set; }
        public string Title { get; set; }
        public string TechnicalSkills { get; set; }
        public string Location { get; set; }
        public string Experience { get; set; }
        public string CvFilename { get; set; }
        public DateTime SignInDate { get; set; }
        public List<JobOfferUserModel> Offers { get; set; }
        public UserType Type { get; set; }
    }
}
