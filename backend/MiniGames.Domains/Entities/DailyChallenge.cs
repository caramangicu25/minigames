using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiniGames.Domains.Entities;

public class DailyChallenge
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    [Required]
    [StringLength(50)]
    public string Game { get; set; } = null!;

    [DataType(DataType.Date)]
    public DateOnly ChallengeDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);

    public double Value { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
