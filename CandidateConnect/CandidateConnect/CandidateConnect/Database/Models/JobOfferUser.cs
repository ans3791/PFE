using System.ComponentModel.DataAnnotations;

namespace CandidateConnect.Database.Models
{
    public class JobOfferUser
    {
        [Key]
        public int Id { get; set; }
        public JobOffer Job { get; set; }
        public User User { get; set; }
        public DateTime DateApplication { get; set; }
        public JobOfferUserStatusEnum Status { get; set; }
    }
}
