namespace MiniGames.Domains.Entities;

public class DailyChallenge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Game { get; set; } = null!;
    public DateOnly ChallengeDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    public double Value { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
