using MiniGames.BusinessLogic.Interface;
using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.DTOs.Score;
using MiniGames.Domains.Entities;

namespace MiniGames.BusinessLogic;

public class ScoreLogic : IScoreLogic
{
    private readonly ScoreRepository _scores = new();
    private readonly UserRepository _users = new();

    public async Task<ScoreDto> SubmitAsync(SubmitScoreRequest request)
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

    public async Task<List<ScoreDto>> GetLeaderboardAsync(string? game)
    {
        var scores = await _scores.GetLeaderboardAsync(game);
        return scores.Select(s => new ScoreDto(s.Id, s.UserId, s.User.Username, s.Game, s.Value, s.CreatedAt)).ToList();
    }

    public async Task<List<ScoreDto>> GetByUserAsync(Guid userId)
    {
        var scores = await _scores.GetByUserAsync(userId);
        return scores.Select(s => new ScoreDto(s.Id, s.UserId, s.User.Username, s.Game, s.Value, s.CreatedAt)).ToList();
    }
}
