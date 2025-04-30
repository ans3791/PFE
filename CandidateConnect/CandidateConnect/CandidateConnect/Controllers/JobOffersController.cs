using CandidateConnect.Database.Models;
using CandidateConnect.Models;
using CandidateConnect.Services.JobOfferr;
using Microsoft.AspNetCore.Mvc;

namespace CandidateConnect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobOffersController(IJobOfferService jobOfferService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateJobOfferAsync([FromBody] JobOfferModel jobOffer)
        {
            await jobOfferService.CreateJobOffer(jobOffer);
            return Ok();
        }
        
        [HttpGet("{count?}")]
        public async Task<IActionResult> GetJobOffersAsync(int? count)
        {
            return Ok(await jobOfferService.GetJobOffers(count));
        }

        [HttpPost("apply/{jobOfferId}/{userId}")]
        public async Task<IActionResult> ApplyAsync(int jobOfferId, int userId)
        {
            await jobOfferService.Apply(jobOfferId, userId);
            return Ok();
        }

        [HttpGet("applications")]
        public async Task<IActionResult> GetApplicationsAsync()
        {
            return Ok(await jobOfferService.GetApplications());
        }

        [HttpPost("applications/{applicationId}/{newStatus}")]
        public async Task<IActionResult> UpdateApplicationStatus(int applicationId, JobOfferUserStatusEnum newStatus)
        {
            await jobOfferService.UpdateApplicationStatus(applicationId, newStatus);
            return Ok();
        }

        [HttpPut("{idJobOffer}")]
        public async Task<IActionResult> UpdateJobOfferAsync(int idJobOffer, [FromBody] JobOfferModel jobOffer)
        {
            await jobOfferService.UpdateJobOffer(idJobOffer, jobOffer);
            return Ok();
        }

        [HttpDelete("{idJobOffer}")]
        public async Task<IActionResult> DeleteJobOfferAsync(int idJobOffer)
        {
            await jobOfferService.DeleteJobOffer(idJobOffer);
            return Ok();
        }
    }
}
