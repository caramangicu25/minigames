namespace MiniGames.Domains.Models.Score;

public record SubmitScoreRequest(
    Guid UserId,
    string Game,
    double Value
);
