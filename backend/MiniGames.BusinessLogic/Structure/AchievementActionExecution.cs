using MiniGames.BusinessLogic.Core;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Achievements;

namespace MiniGames.BusinessLogic.Structure;

public class AchievementActionExecution : AchievementActions, IAchievementLogic
{
    public async Task<List<AchievementDto>> GetUserAchievementsAsync(Guid userId)
        => await GetUserAchievementsActionExecution(userId);

    public async Task<List<AchievementDto>> CheckAndUnlockAsync(Guid userId, string game, double value)
        => await CheckAndUnlockActionExecution(userId, game, value);

    public async Task UnlockFriendAchievementAsync(Guid userId)
        => await UnlockFriendAchievementActionExecution(userId);
}
