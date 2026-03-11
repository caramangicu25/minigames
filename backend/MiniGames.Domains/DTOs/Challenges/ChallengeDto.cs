namespace MiniGames.Domains.DTOs.Challenges;

public record DailyChallengeEntry(Guid UserId, string Username, string Game, double Value, DateTime CreatedAt);
public record SubmitChallengeRequest(Guid UserId, string Game, double Value);
