namespace MiniGames.Domains.Models.Achievements;

public record AchievementDto(string Key, string Title, string Description, string Icon, DateTime? UnlockedAt);
public record CheckAchievementsRequest(Guid UserId, string Game, double Value);
