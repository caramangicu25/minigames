using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiniGames.Domains.Entities;

public class RefreshToken
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    [Required]
    public string Token { get; set; } = null!;

    [Required]
    [StringLength(45)]
    public string CreatedByIp { get; set; } = null!;

    [DataType(DataType.DateTime)]
    public DateTime ExpiresAt { get; set; }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
