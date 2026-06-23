using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MiniGames.Domains.Entities;

public class Friendship
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid RequesterId { get; set; }

    [ForeignKey("RequesterId")]
    public User Requester { get; set; } = null!;

    [Required]
    public Guid AddresseeId { get; set; }

    [ForeignKey("AddresseeId")]
    public User Addressee { get; set; } = null!;

    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "pending";

    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
