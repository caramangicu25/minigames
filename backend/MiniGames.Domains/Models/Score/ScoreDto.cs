namespace MiniGames.Domains.Models.Score;

public record ScoreDto(
    Guid Id,
    Guid UserId,
    string Username,
    string Game,
    double Value,
    DateTime CreatedAt
);
