using DotNetEnv;
using MiniGames.Api.Extensions;
using MiniGames.DataAccess;
using MiniGames.Domains;
using Microsoft.EntityFrameworkCore;

// Load .env
var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(envPath)) Env.Load(envPath);

var builder = WebApplication.CreateBuilder(args);

// Override from environment
var connStr = Environment.GetEnvironmentVariable("DB_CONNECTION")
           ?? builder.Configuration.GetConnectionString("DefaultConnection")
           ?? throw new InvalidOperationException("Database connection string is missing.");

DbSession.ConnectionString = connStr;

builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connStr));

builder.Services.AddMiniGamesJwt(builder.Configuration);
builder.Services.AddMiniGamesCors(builder.Configuration);
builder.Services.AddMiniGamesSwagger();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Auto-create tables
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5050";
app.Run($"http://0.0.0.0:{port}");
