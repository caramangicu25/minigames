using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.DTOs.Challenges;
using MiniGames.Domains.Entities;

namespace MiniGames.BusinessLogic;

public class ChallengeLogic
{
    private readonly ChallengeRepository _repo = new();
    private readonly UserRepository _users = new();

    public async Task<DailyChallengeEntry> SubmitAsync(Guid userId, string game, double value)
    {
        var user = await _users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");
        var existing = await _repo.GetTodayAsync(userId, game);
        if (existing is not null)
            throw new InvalidOperationException("You already submitted a challenge score today for this game.");
        var challenge = new DailyChallenge { UserId = userId, Game = game, Value = value };
        await _repo.SubmitAsync(challenge);
        return new DailyChallengeEntry(userId, user.Username, game, value, challenge.CreatedAt);
    }

    public async Task<bool> HasSubmittedTodayAsync(Guid userId, string game)
        => await _repo.GetTodayAsync(userId, game) is not null;

    public async Task<List<DailyChallengeEntry>> GetTodayLeaderboardAsync(string game)
    {
        var entries = await _repo.GetTodayLeaderboardAsync(game);
        return entries.Select(d => new DailyChallengeEntry(d.UserId, d.User.Username, d.Game, d.Value, d.CreatedAt)).ToList();
    }
}
