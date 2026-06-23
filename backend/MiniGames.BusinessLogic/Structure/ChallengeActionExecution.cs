using MiniGames.BusinessLogic.Core;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Challenges;

namespace MiniGames.BusinessLogic.Structure;

public class ChallengeActionExecution : ChallengeActions, IChallengeLogic
{
    public async Task<DailyChallengeEntry> SubmitAsync(Guid userId, string game, double value)
        => await SubmitActionExecution(userId, game, value);

    public async Task<bool> HasSubmittedTodayAsync(Guid userId, string game)
        => await HasSubmittedTodayActionExecution(userId, game);

    public async Task<List<DailyChallengeEntry>> GetTodayLeaderboardAsync(string game)
        => await GetTodayLeaderboardActionExecution(game);
}
