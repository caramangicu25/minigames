using Microsoft.EntityFrameworkCore;
using MiniGames.Domains;

namespace MiniGames.DataAccess;

public static class DbSession
{
    public static string? ConnectionString { get; set; }

    public static AppDbContext Create()
    {
        if (string.IsNullOrWhiteSpace(ConnectionString))
            throw new InvalidOperationException("ConnectionString is not configured.");

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(ConnectionString)
            .Options;

        return new AppDbContext(options);
    }
}
