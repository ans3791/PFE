using CandidateConnect.Database.Models;
using CandidateConnect.Models;

namespace CandidateConnect.Services.JobOfferr
{
    public interface IJobOfferService
    {
        Task CreateJobOffer(JobOfferModel jobOffer);
        Task<List<JobOfferModel>> GetJobOffers(int? count);
        Task Apply(int jobOfferId, int userId);
        Task<List<ApplicationModel>> GetApplications();
        Task UpdateApplicationStatus(int applicationId, JobOfferUserStatusEnum newStatus);
        Task UpdateJobOffer(int idJobOffer, JobOfferModel jobOffer);
        Task DeleteJobOffer(int idJobOffer);
    }
}