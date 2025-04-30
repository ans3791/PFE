using CandidateConnect.Configurations;
using CandidateConnect.Database;
using CandidateConnect.Middlewares;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var Configuration = new ConfigurationBuilder()
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .Build();
builder.Services.Configure<AppSettings>(Configuration);

var connectionString = Configuration.GetSection("Database")["ConnectionString"] ??
                throw new InvalidOperationException("Connection string not found.");

builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseNpgsql(connectionString);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.RegisterServices();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors("AllowOrigin");

app.UseMiddleware<ExceptionHandlerMiddleware>();
app.MapControllers();

try
{
    app.Run();
}
catch (Exception ex)
{
}
finally
{
}
