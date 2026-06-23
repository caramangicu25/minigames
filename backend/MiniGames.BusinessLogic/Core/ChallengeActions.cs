using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.Models.Challenges;
using MiniGames.Domains.Entities;

namespace MiniGames.BusinessLogic.Core;

public class ChallengeActions
{
    protected ChallengeActions() { }

    private readonly ChallengeRepository _repo = new();
    private readonly UserRepository _users = new();

    protected async Task<DailyChallengeEntry> SubmitActionExecution(Guid userId, string game, double value)
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

    protected async Task<bool> HasSubmittedTodayActionExecution(Guid userId, string game)
        => await _repo.GetTodayAsync(userId, game) is not null;

    protected async Task<List<DailyChallengeEntry>> GetTodayLeaderboardActionExecution(string game)
    {
        var entries = await _repo.GetTodayLeaderboardAsync(game);
        return entries.Select(d => new DailyChallengeEntry(d.UserId, d.User.Username, d.Game, d.Value, d.CreatedAt)).ToList();
    }
}
