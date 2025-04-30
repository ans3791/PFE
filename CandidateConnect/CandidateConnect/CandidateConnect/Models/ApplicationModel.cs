using CandidateConnect.Database.Models;

namespace CandidateConnect.Models
{
    public class ApplicationModel
    {
        public int Id { get; set; }
        public JobOfferModel Job { get; set; }
        public UserModel User { get; set; }
        public DateTime DateApplication { get; set; }
        public JobOfferUserStatusEnum Status { get; set; }
    }
}
