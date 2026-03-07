using Microsoft.EntityFrameworkCore;
using MiniGames.Domains.Entities;

namespace MiniGames.DataAccess.Repositories;

public class FriendshipRepository
{
    public async Task<Friendship?> GetAsync(Guid requesterId, Guid addresseeId)
    {
        await using var db = DbSession.Create();
        return await db.Friendships.FirstOrDefaultAsync(f =>
            (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
            (f.RequesterId == addresseeId && f.AddresseeId == requesterId));
    }

    public async Task<Friendship> AddAsync(Friendship f)
    {
        await using var db = DbSession.Create();
        db.Friendships.Add(f);
        await db.SaveChangesAsync();
        return f;
    }

    public async Task<bool> UpdateStatusAsync(Guid id, string status)
    {
        await using var db = DbSession.Create();
        var f = await db.Friendships.FindAsync(id);
        if (f is null) return false;
        f.Status = status;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        await using var db = DbSession.Create();
        var f = await db.Friendships.FindAsync(id);
        if (f is null) return false;
        db.Friendships.Remove(f);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<List<Friendship>> GetAllForUserAsync(Guid userId)
    {
        await using var db = DbSession.Create();
        return await db.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .Where(f => (f.RequesterId == userId || f.AddresseeId == userId))
            .ToListAsync();
    }

    public async Task<List<Guid>> GetAcceptedFriendIdsAsync(Guid userId)
    {
        await using var db = DbSession.Create();
        var friendships = await db.Friendships
            .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) && f.Status == "accepted")
            .ToListAsync();
        return friendships.Select(f => f.RequesterId == userId ? f.AddresseeId : f.RequesterId).ToList();
    }
}
