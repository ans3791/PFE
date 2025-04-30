using CandidateConnect.Services.JobOfferr;
using CandidateConnect.Services.UserService;

namespace CandidateConnect.Configurations
{
    public static class ServicesInjection
    {
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IJobOfferService, JobOfferService>();
        }
    }
}
