using CandidateConnect.Database.Models;

namespace CandidateConnect.Models
{
    public class JobOfferModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public JobOfferStatus Status { get; set; }
        public string Location { get; set; }
        public string Salary { get; set; }
        public string Experience { get; set; }
        public DateTime PublishDate { get; set; }
    }
}
