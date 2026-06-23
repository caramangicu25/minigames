using MiniGames.Domains.Models.Achievements;

namespace MiniGames.BusinessLogic.Interfaces;

public interface IAchievementLogic
{
    Task<List<AchievementDto>> GetUserAchievementsAsync(Guid userId);
    Task<List<AchievementDto>> CheckAndUnlockAsync(Guid userId, string game, double value);
    Task UnlockFriendAchievementAsync(Guid userId);
}
