using Microsoft.EntityFrameworkCore;
using MiniGames.Domains.Entities;

namespace MiniGames.DataAccess.Repositories;

public class AchievementRepository
{
    public async Task<List<UserAchievement>> GetByUserAsync(Guid userId)
    {
        await using var db = DbSession.Create();
        return await db.UserAchievements
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }

    public async Task<bool> HasAsync(Guid userId, string key)
    {
        await using var db = DbSession.Create();
        return await db.UserAchievements.AnyAsync(a => a.UserId == userId && a.AchievementKey == key);
    }

    public async Task<UserAchievement?> UnlockAsync(Guid userId, string key)
    {
        if (await HasAsync(userId, key)) return null;
        await using var db = DbSession.Create();
        var ua = new UserAchievement { UserId = userId, AchievementKey = key };
        db.UserAchievements.Add(ua);
        await db.SaveChangesAsync();
        return ua;
    }
}
