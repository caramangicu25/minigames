using Microsoft.EntityFrameworkCore;
using MiniGames.Domains.Entities;

namespace MiniGames.DataAccess.Repositories;

public class ChatRepository
{
    public async Task<ChatMessage> AddAsync(ChatMessage msg)
    {
        await using var db = DbSession.Create();
        db.ChatMessages.Add(msg);
        await db.SaveChangesAsync();
        return msg;
    }

    public async Task<List<ChatMessage>> GetRecentAsync(int limit = 50)
    {
        await using var db = DbSession.Create();
        return await db.ChatMessages
            .Include(m => m.User)
            .OrderByDescending(m => m.CreatedAt)
            .Take(limit)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        await using var db = DbSession.Create();
        var msg = await db.ChatMessages.FindAsync(id);
        if (msg is null) return false;
        db.ChatMessages.Remove(msg);
        await db.SaveChangesAsync();
        return true;
    }
}
