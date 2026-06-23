using MiniGames.Domains.Models.Challenges;

namespace MiniGames.BusinessLogic.Interfaces;

public interface IChallengeLogic
{
    Task<DailyChallengeEntry> SubmitAsync(Guid userId, string game, double value);
    Task<bool> HasSubmittedTodayAsync(Guid userId, string game);
    Task<List<DailyChallengeEntry>> GetTodayLeaderboardAsync(string game);
}
