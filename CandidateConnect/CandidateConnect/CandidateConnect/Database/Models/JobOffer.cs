using System.ComponentModel.DataAnnotations;

namespace CandidateConnect.Database.Models
{
    public class JobOffer
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public JobOfferStatus Status { get; set; }
        public string Location { get; set; }
        public string Salary { get; set; }
        public string Experience { get; set; }
        public DateTime PublishDate { get; set; }
        public List<JobOfferUser> Candidates { get; set; }
    }
}
