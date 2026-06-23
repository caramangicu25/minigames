using MiniGames.BusinessLogic.Core;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Chat;

namespace MiniGames.BusinessLogic.Structure;

public class ChatActionExecution : ChatActions, IChatLogic
{
    public async Task<ChatMessageDto> SendAsync(Guid userId, string username, string content)
        => await SendActionExecution(userId, username, content);

    public async Task<List<ChatMessageDto>> GetRecentAsync()
        => await GetRecentActionExecution();

    public async Task<bool> DeleteAsync(Guid id)
        => await DeleteActionExecution(id);
}
