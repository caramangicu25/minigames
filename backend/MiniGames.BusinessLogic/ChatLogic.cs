using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.DTOs.Chat;
using MiniGames.Domains.Entities;

namespace MiniGames.BusinessLogic;

public class ChatLogic
{
    private readonly ChatRepository _repo = new();

    public async Task<ChatMessageDto> SendAsync(Guid userId, string username, string content)
    {
        if (string.IsNullOrWhiteSpace(content) || content.Length > 300)
            throw new InvalidOperationException("Message must be 1-300 characters.");
        var msg = new ChatMessage { UserId = userId, Content = content.Trim() };
        await _repo.AddAsync(msg);
        return new ChatMessageDto(msg.Id, userId, username, msg.Content, msg.CreatedAt);
    }

    public async Task<List<ChatMessageDto>> GetRecentAsync()
    {
        var msgs = await _repo.GetRecentAsync(50);
        return msgs.Select(m => new ChatMessageDto(m.Id, m.UserId, m.User.Username, m.Content, m.CreatedAt)).ToList();
    }

    public async Task<bool> DeleteAsync(Guid id) => await _repo.DeleteAsync(id);
}
