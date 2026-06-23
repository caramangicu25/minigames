using MiniGames.Domains.Models.Chat;

namespace MiniGames.BusinessLogic.Interfaces;

public interface IChatLogic
{
    Task<ChatMessageDto> SendAsync(Guid userId, string username, string content);
    Task<List<ChatMessageDto>> GetRecentAsync();
    Task<bool> DeleteAsync(Guid id);
}
