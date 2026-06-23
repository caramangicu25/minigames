using Microsoft.EntityFrameworkCore;
using MiniGames.Domains.Entities;

namespace MiniGames.DataAccess.Repositories;

public class RefreshTokenRepository
{
    public async Task<RefreshToken> AddAsync(RefreshToken token)
    {
        await using var db = DbSession.Create();
        db.RefreshTokens.Add(token);
        await db.SaveChangesAsync();
        return token;
    }

    public async Task<RefreshToken?> GetAsync(string token)
    {
        await using var db = DbSession.Create();
        return await db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == token);
    }

    public async Task DeleteAsync(Guid id)
    {
        await using var db = DbSession.Create();
        var t = await db.RefreshTokens.FindAsync(id);
        if (t is not null) { db.RefreshTokens.Remove(t); await db.SaveChangesAsync(); }
    }

    public async Task DeleteByUserAsync(Guid userId)
    {
        await using var db = DbSession.Create();
        var tokens = db.RefreshTokens.Where(r => r.UserId == userId);
        db.RefreshTokens.RemoveRange(tokens);
        await db.SaveChangesAsync();
    }
}
