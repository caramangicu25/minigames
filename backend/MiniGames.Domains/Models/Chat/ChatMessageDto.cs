namespace MiniGames.Domains.Models.Chat;

public record ChatMessageDto(Guid Id, Guid UserId, string Username, string Content, DateTime CreatedAt);
public record SendMessageRequest(string Content);
