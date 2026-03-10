namespace MiniGames.Domains.DTOs.Score;

public record SubmitScoreRequest(
    Guid UserId,
    string Game,
    double Value
);
