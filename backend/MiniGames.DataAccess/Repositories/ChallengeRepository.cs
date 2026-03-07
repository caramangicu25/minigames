using Microsoft.EntityFrameworkCore;
using MiniGames.Domains.Entities;

namespace MiniGames.DataAccess.Repositories;

public class ChallengeRepository
{
    public async Task<DailyChallenge?> GetTodayAsync(Guid userId, string game)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        await using var db = DbSession.Create();
        return await db.DailyChallenges.FirstOrDefaultAsync(d =>
            d.UserId == userId && d.Game == game && d.ChallengeDate == today);
    }

    public async Task<DailyChallenge> SubmitAsync(DailyChallenge challenge)
    {
        await using var db = DbSession.Create();
        db.DailyChallenges.Add(challenge);
        await db.SaveChangesAsync();
        return challenge;
    }

    public async Task<List<DailyChallenge>> GetTodayLeaderboardAsync(string game)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        await using var db = DbSession.Create();
        return await db.DailyChallenges
            .Include(d => d.User)
            .Where(d => d.Game == game && d.ChallengeDate == today)
            .OrderByDescending(d => d.Value)
            .Take(10)
            .ToListAsync();
    }
}
