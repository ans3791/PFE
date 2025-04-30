using CandidateConnect.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace CandidateConnect.Database
{
    public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<JobOffer> JobOffers { get; set; }
        public DbSet<JobOfferUser> JobOfferUser { get; set; }
    }
}
