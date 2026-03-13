using MiniGames.Domains.DTOs.Score;

namespace MiniGames.BusinessLogic.Interface;

public interface IScoreLogic
{
    Task<ScoreDto> SubmitAsync(SubmitScoreRequest request);
    Task<List<ScoreDto>> GetLeaderboardAsync(string? game);
    Task<List<ScoreDto>> GetByUserAsync(Guid userId);
}
