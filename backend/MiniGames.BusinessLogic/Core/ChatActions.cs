using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.Models.Chat;
using MiniGames.Domains.Entities;

namespace MiniGames.BusinessLogic.Core;

public class ChatActions
{
    protected ChatActions() { }

    private readonly ChatRepository _repo = new();

    protected async Task<ChatMessageDto> SendActionExecution(Guid userId, string username, string content)
    {
        if (string.IsNullOrWhiteSpace(content) || content.Length > 300)
            throw new InvalidOperationException("Message must be 1-300 characters.");
        var msg = new ChatMessage { UserId = userId, Content = content.Trim() };
        await _repo.AddAsync(msg);
        return new ChatMessageDto(msg.Id, userId, username, msg.Content, msg.CreatedAt);
    }

    protected async Task<List<ChatMessageDto>> GetRecentActionExecution()
    {
        var msgs = await _repo.GetRecentAsync(50);
        return msgs.Select(m => new ChatMessageDto(m.Id, m.UserId, m.User.Username, m.Content, m.CreatedAt)).ToList();
    }

    protected async Task<bool> DeleteActionExecution(Guid id) => await _repo.DeleteAsync(id);
}
