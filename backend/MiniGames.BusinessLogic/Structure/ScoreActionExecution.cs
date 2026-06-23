using MiniGames.BusinessLogic.Core;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Score;

namespace MiniGames.BusinessLogic.Structure;

public class ScoreActionExecution : ScoreActions, IScoreLogic
{
    public async Task<ScoreDto> SubmitAsync(SubmitScoreRequest request)
        => await SubmitActionExecution(request);

    public async Task<List<ScoreDto>> GetLeaderboardAsync(string? game)
        => await GetLeaderboardActionExecution(game);

    public async Task<List<ScoreDto>> GetByUserAsync(Guid userId)
        => await GetByUserActionExecution(userId);
}
