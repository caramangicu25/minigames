using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.Models.Achievements;

namespace MiniGames.BusinessLogic.Core;

public static class AchievementDefinitions
{
    public static readonly List<AchievementDto> All =
    [
        new("first_game",       "First Steps",        "Play your first game.",                        "🎮", null),
        new("sudoku_complete",  "Puzzle Solver",       "Complete a Sudoku.",                           "🔢", null),
        new("sudoku_fast",      "Speed Puzzler",       "Complete Sudoku in under 3 minutes.",          "⚡", null),
        new("sudoku_master",    "Sudoku Master",       "Complete Sudoku in under 2 minutes.",          "🏆", null),
        new("memory_10moves",   "Sharp Memory",        "Complete Memory in 10 moves or fewer.",        "🧠", null),
        new("clicker_5cps",     "Fast Clicker",        "Reach 5 clicks/second.",                       "👆", null),
        new("clicker_10cps",    "Speed Demon",         "Reach 10 clicks/second.",                      "⚡", null),
        new("snake_50",         "Snake Charmer",       "Score 50 points in Snake.",                    "🐍", null),
        new("snake_100",        "Snake Master",        "Score 100 points in Snake.",                   "👑", null),
        new("tictactoe_win",    "Tic Tac Toe Winner",  "Win a game of Tic Tac Toe.",                  "✖", null),
        new("friend_added",     "Social Butterfly",    "Add your first friend.",                       "👥", null),
    ];
}

public class AchievementActions
{
    protected AchievementActions() { }

    private readonly AchievementRepository _repo = new();

    protected async Task<List<AchievementDto>> GetUserAchievementsActionExecution(Guid userId)
    {
        var unlocked = await _repo.GetByUserAsync(userId);
        var unlockedKeys = unlocked.ToDictionary(u => u.AchievementKey, u => u.UnlockedAt);
        return AchievementDefinitions.All.Select(a =>
            a with { UnlockedAt = unlockedKeys.TryGetValue(a.Key, out var dt) ? dt : null }).ToList();
    }

    protected async Task<List<AchievementDto>> CheckAndUnlockActionExecution(Guid userId, string game, double value)
    {
        var newlyUnlocked = new List<AchievementDto>();

        async Task TryUnlock(string key)
        {
            var ua = await _repo.UnlockAsync(userId, key);
            if (ua is not null)
            {
                var def = AchievementDefinitions.All.First(a => a.Key == key);
                newlyUnlocked.Add(def with { UnlockedAt = ua.UnlockedAt });
            }
        }

        await TryUnlock("first_game");

        switch (game)
        {
            case "sudoku":
                await TryUnlock("sudoku_complete");
                if (value < 180) await TryUnlock("sudoku_fast");
                if (value < 120) await TryUnlock("sudoku_master");
                break;
            case "memory":
                if (value <= 10) await TryUnlock("memory_10moves");
                break;
            case "click-speed":
                if (value >= 5) await TryUnlock("clicker_5cps");
                if (value >= 10) await TryUnlock("clicker_10cps");
                break;
            case "snake":
                if (value >= 50) await TryUnlock("snake_50");
                if (value >= 100) await TryUnlock("snake_100");
                break;
            case "tic-tac-toe":
                await TryUnlock("tictactoe_win");
                break;
        }

        return newlyUnlocked;
    }

    protected async Task UnlockFriendAchievementActionExecution(Guid userId) =>
        await _repo.UnlockAsync(userId, "friend_added");
}
