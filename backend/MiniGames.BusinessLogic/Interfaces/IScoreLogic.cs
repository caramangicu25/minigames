using MiniGames.Domains.Models.Score;

namespace MiniGames.BusinessLogic.Interfaces;

public interface IScoreLogic
{
    Task<ScoreDto> SubmitAsync(SubmitScoreRequest request);
    Task<List<ScoreDto>> GetLeaderboardAsync(string? game);
    Task<List<ScoreDto>> GetByUserAsync(Guid userId);
}
