using CandidateConnect.Configurations;
using CandidateConnect.Database;
using CandidateConnect.Database.Models;
using CandidateConnect.Models;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using Mailkit = MailKit.Net.Smtp;

namespace CandidateConnect.Services.JobOfferr
{
    public class JobOfferService(DatabaseContext database, IOptions<AppSettings> appSettings) : IJobOfferService
    {
        public async Task CreateJobOffer(JobOfferModel jobOffer)
        {
            JobOffer newJobOffer = new()
            {
                Title = jobOffer.Title,
                Description = jobOffer.Description,
                Status = JobOfferStatus.Active,
                Salary = jobOffer.Salary,
                Experience = jobOffer.Experience,
                Location = jobOffer.Location,
                PublishDate = DateTime.Now.ToUniversalTime()
            };
            await database.JobOffers.AddAsync(newJobOffer);
            await database.SaveChangesAsync();
        }

        public async Task<List<JobOfferModel>> GetJobOffers(int? count)
        {
            var query = database.JobOffers.AsQueryable();
            if (count.HasValue)
            {
                query = query.Take(count.Value);
            }
            var jobs = await query.OrderByDescending(j => j.PublishDate).ToListAsync();
            return jobs.Select(job => new JobOfferModel
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                Status = job.Status,
                Location = job.Location,
                Salary = job.Salary,
                Experience = job.Experience,
                PublishDate = job.PublishDate,
            }).ToList();
        }

        public async Task Apply(int jobOfferId, int userId)
        {
            bool alreadyApplied = await database.JobOfferUser
                .AnyAsync(ju => ju.Job.Id == jobOfferId && ju.User.Id == userId);
            if (!alreadyApplied)
            {
                var user = await database.Users.SingleOrDefaultAsync(u => u.Id == userId);
                var job = await database.JobOffers.SingleOrDefaultAsync(u => u.Id == jobOfferId);
                await database.JobOfferUser.AddAsync(new JobOfferUser()
                {
                    User = user,
                    Job = job,
                    DateApplication = DateTime.Now.ToUniversalTime(),
                    Status = JobOfferUserStatusEnum.Pending
                });
                await database.SaveChangesAsync();
            }
        }

        public async Task<List<ApplicationModel>> GetApplications()
        {
            var applications = await database.JobOfferUser
                .Include(j => j.Job)
                .Include(j => j.User)
                .Where(j => j.Status == JobOfferUserStatusEnum.Pending || j.Status == JobOfferUserStatusEnum.Planned)
                .OrderBy(j => j.DateApplication)
                .ToListAsync();
            return applications.Select(a => new ApplicationModel()
            {
                Id = a.Id,
                Job = new JobOfferModel()
                {
                    Id = a.Job.Id,
                    Title = a.Job.Title,
                    Description = a.Job.Description,
                    Status = a.Job.Status,
                    Location = a.Job.Location,
                    Salary = a.Job.Salary,
                    Experience = a.Job.Experience,
                    PublishDate = a.Job.PublishDate,
                },
                User = new UserModel()
                {
                    Id = a.User.Id,
                    FirstName = a.User.FirstName,
                    LastName = a.User.LastName,
                    Email = a.User.Email,
                    PhoneNumber = a.User.PhoneNumber,
                    Summary = a.User.Summary,
                    Title = a.User.Title,
                    TechnicalSkills = a.User.TechnicalSkills,
                    Location = a.User.Location,
                    Experience = a.User.Experience,
                    CvFilename = a.User.CvFilename,
                    SignInDate = a.User.SignInDate,
                    Type = a.User.Type
                },
                DateApplication = a.DateApplication,
                Status = a.Status
            }).ToList();
        }

        public async Task UpdateApplicationStatus(int applicationId, JobOfferUserStatusEnum newStatus)
        {
            var application = await database.JobOfferUser
                .Include(j => j.Job)
                .Include(j => j.User)
                .FirstOrDefaultAsync(j => j.Id == applicationId);
            application.Status = newStatus;
            if (newStatus == JobOfferUserStatusEnum.Approved)
            {
                // close the job offer
                var job = application.Job;
                job.Status = JobOfferStatus.Closed;
                database.JobOffers.Update(job);
            }
            await database.SaveChangesAsync();
            await SendNotificationAsync(application.User, application.Job, newStatus);
        }

        public async Task SendNotificationAsync(User user, JobOffer job, JobOfferUserStatusEnum newStatus)
        {
            var templateFilePath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "Files",
                    "EmailTemplate",
                    "notification.html"
                );

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(appSettings.Value.Smtp.Email));
            email.To.Add(MailboxAddress.Parse(user.Email));
            email.Subject = "Update on Your Job Application";

            var bodyHtml = File.ReadAllText(templateFilePath);

            string message = newStatus switch
            {
                JobOfferUserStatusEnum.Planned => "Your application has been moved to the next step. We will contact you soon to plan an interview.",
                JobOfferUserStatusEnum.Approved => "Congratulations! Your application has been approved. We will be in touch for the next steps.",
                JobOfferUserStatusEnum.Rejected => "Thank you for your interest. Unfortunately, we will not be moving forward with your application.",
                _ => string.Empty
            };

            // Replace placeholders with actual values
            bodyHtml = bodyHtml.Replace("{fullname}", user.FirstName + " " + user.LastName);
            bodyHtml = bodyHtml.Replace("{message}", message);

            email.Body = new TextPart(TextFormat.Html) { Text = bodyHtml };

            try
            {
                using var smtp = new Mailkit.SmtpClient();
                smtp.Connect(appSettings.Value.Smtp.Host, 587, SecureSocketOptions.StartTls);
                smtp.Authenticate(appSettings.Value.Smtp.Email, appSettings.Value.Smtp.Password);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            }
            catch (Exception ex)
            {
                throw new Exception("smtpErr");
            }
        }

        public async Task UpdateJobOffer(int idJobOffer, JobOfferModel jobOffer)
        {
            var oldJobOffer = await database.JobOffers.FirstOrDefaultAsync(j => j.Id == idJobOffer);
            if (oldJobOffer != null)
            {
                oldJobOffer.Title = jobOffer.Title;
                oldJobOffer.Description = jobOffer.Description;
                oldJobOffer.Location = jobOffer.Location;
                oldJobOffer.Experience = jobOffer.Experience;
                oldJobOffer.Salary = jobOffer.Salary;
            }
            database.JobOffers.Update(oldJobOffer);
            await database.SaveChangesAsync();
        }

        public async Task DeleteJobOffer(int idJobOffer)
        {
            var oldJobOffer = await database.JobOffers.FirstOrDefaultAsync(j => j.Id == idJobOffer);
            if (oldJobOffer != null)
            {
                database.JobOffers.Remove(oldJobOffer);
                await database.SaveChangesAsync();
            }
        }
    }
}
