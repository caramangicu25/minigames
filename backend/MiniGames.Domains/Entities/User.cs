using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiniGames.Domains.Entities;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(30, MinimumLength = 3)]
    public string Username { get; set; } = null!;

    [Required]
    [StringLength(60)]
    public string FullName { get; set; } = null!;

    [Required]
    [StringLength(100)]
    [DataType(DataType.EmailAddress)]
    public string Email { get; set; } = null!;

    [Required]
    public string PasswordHash { get; set; } = null!;

    [Required]
    public string SecurityStamp { get; set; } = Guid.NewGuid().ToString();

    public bool IsActive { get; set; } = true;

    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Score> Scores { get; set; } = [];
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}
