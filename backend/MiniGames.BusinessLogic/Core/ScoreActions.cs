using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.Models.Score;
using MiniGames.Domains.Entities;

namespace MiniGames.BusinessLogic.Core;

public class ScoreActions
{
    protected ScoreActions() { }

    private readonly ScoreRepository _scores = new();
    private readonly UserRepository _users = new();

    protected async Task<ScoreDto> SubmitActionExecution(SubmitScoreRequest request)
    {
        var user = await _users.GetByIdAsync(request.UserId)
            ?? throw new KeyNotFoundException("User not found.");

        var score = new Score
        {
            UserId = request.UserId,
            Game = request.Game,
            Value = request.Value,
        };

        var saved = await _scores.AddAsync(score);
        return new ScoreDto(saved.Id, saved.UserId, user.Username, saved.Game, saved.Value, saved.CreatedAt);
    }

    protected async Task<List<ScoreDto>> GetLeaderboardActionExecution(string? game)
    {
        var scores = await _scores.GetLeaderboardAsync(game);
        return scores.Select(s => new ScoreDto(s.Id, s.UserId, s.User.Username, s.Game, s.Value, s.CreatedAt)).ToList();
    }

    protected async Task<List<ScoreDto>> GetByUserActionExecution(Guid userId)
    {
        var scores = await _scores.GetByUserAsync(userId);
        return scores.Select(s => new ScoreDto(s.Id, s.UserId, s.User.Username, s.Game, s.Value, s.CreatedAt)).ToList();
    }
}
