using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiniGames.Domains.Entities;

public class UserAchievement
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string AchievementKey { get; set; } = null!;

    [DataType(DataType.DateTime)]
    public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;
}
