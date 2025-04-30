
using CandidateConnect.Database.Models;

namespace CandidateConnect.Models
{
    public class JobOfferUserModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DateApplication { get; set; }
        public JobOfferUserStatusEnum Status { get; set; }
    }
}
