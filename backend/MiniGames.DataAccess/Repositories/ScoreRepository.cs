using Microsoft.EntityFrameworkCore;
using MiniGames.Domains.Entities;

namespace MiniGames.DataAccess.Repositories;

public class ScoreRepository
{
    public async Task<Score> AddAsync(Score score)
    {
        await using var db = DbSession.Create();
        db.Scores.Add(score);
        await db.SaveChangesAsync();
        return score;
    }

    public async Task<List<Score>> GetByUserAsync(Guid userId)
    {
        await using var db = DbSession.Create();
        return await db.Scores
            .Where(s => s.UserId == userId)
            .Include(s => s.User)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Score>> GetLeaderboardAsync(string? game, int limit = 5)
    {
        await using var db = DbSession.Create();
        var q = db.Scores.Include(s => s.User).AsQueryable();
        if (!string.IsNullOrEmpty(game)) q = q.Where(s => s.Game == game);
        return await q.OrderByDescending(s => s.Value).Take(limit).ToListAsync();
    }
}
