namespace MiniGames.Domains.Entities;

public class Friendship
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RequesterId { get; set; }
    public User Requester { get; set; } = null!;
    public Guid AddresseeId { get; set; }
    public User Addressee { get; set; } = null!;
    public string Status { get; set; } = "pending"; // pending | accepted | rejected
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
