using Microsoft.EntityFrameworkCore;
using MiniGames.Domains.Entities;

namespace MiniGames.Domains;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Score> Scores => Set<Score>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Friendship> Friendships => Set<Friendship>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();
    public DbSet<DailyChallenge> DailyChallenges => Set<DailyChallenge>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasKey(u => u.Id);
            e.Property(u => u.Id).HasColumnName("id");
            e.Property(u => u.Username).HasColumnName("username");
            e.Property(u => u.FullName).HasColumnName("fullname");
            e.Property(u => u.Email).HasColumnName("email");
            e.Property(u => u.PasswordHash).HasColumnName("passwordhash");
            e.Property(u => u.SecurityStamp).HasColumnName("securitystamp");
            e.Property(u => u.IsActive).HasColumnName("isactive");
            e.Property(u => u.CreatedAt).HasColumnName("createdat");
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Username).IsUnique();
            e.HasMany(u => u.Scores).WithOne(s => s.User).HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(u => u.RefreshTokens).WithOne(r => r.User).HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        mb.Entity<Score>(e =>
        {
            e.ToTable("scores");
            e.HasKey(s => s.Id);
            e.Property(s => s.Id).HasColumnName("id");
            e.Property(s => s.UserId).HasColumnName("userid");
            e.Property(s => s.Game).HasColumnName("game");
            e.Property(s => s.Value).HasColumnName("value");
            e.Property(s => s.CreatedAt).HasColumnName("createdat");
            e.HasIndex(s => new { s.UserId, s.Game });
        });

        mb.Entity<RefreshToken>(e =>
        {
            e.ToTable("refreshtokens");
            e.HasKey(r => r.Id);
            e.Property(r => r.Id).HasColumnName("id");
            e.Property(r => r.UserId).HasColumnName("userid");
            e.Property(r => r.Token).HasColumnName("token");
            e.Property(r => r.CreatedByIp).HasColumnName("createdbyip");
            e.Property(r => r.ExpiresAt).HasColumnName("expiresat");
            e.Property(r => r.CreatedAt).HasColumnName("createdat");
        });

        mb.Entity<Friendship>(e =>
        {
            e.ToTable("friendships");
            e.HasKey(f => f.Id);
            e.Property(f => f.Id).HasColumnName("id");
            e.Property(f => f.RequesterId).HasColumnName("requesterid");
            e.Property(f => f.AddresseeId).HasColumnName("addresseeid");
            e.Property(f => f.Status).HasColumnName("status");
            e.Property(f => f.CreatedAt).HasColumnName("createdat");
            e.HasOne(f => f.Requester).WithMany().HasForeignKey(f => f.RequesterId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(f => f.Addressee).WithMany().HasForeignKey(f => f.AddresseeId).OnDelete(DeleteBehavior.Cascade);
        });

        mb.Entity<ChatMessage>(e =>
        {
            e.ToTable("chatmessages");
            e.HasKey(c => c.Id);
            e.Property(c => c.Id).HasColumnName("id");
            e.Property(c => c.UserId).HasColumnName("userid");
            e.Property(c => c.Content).HasColumnName("content");
            e.Property(c => c.CreatedAt).HasColumnName("createdat");
            e.HasOne(c => c.User).WithMany().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        mb.Entity<UserAchievement>(e =>
        {
            e.ToTable("userachievements");
            e.HasKey(a => a.Id);
            e.Property(a => a.Id).HasColumnName("id");
            e.Property(a => a.UserId).HasColumnName("userid");
            e.Property(a => a.AchievementKey).HasColumnName("achievementkey");
            e.Property(a => a.UnlockedAt).HasColumnName("unlockedat");
            e.HasOne(a => a.User).WithMany().HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(a => new { a.UserId, a.AchievementKey }).IsUnique();
        });

        mb.Entity<DailyChallenge>(e =>
        {
            e.ToTable("dailychallenges");
            e.HasKey(d => d.Id);
            e.Property(d => d.Id).HasColumnName("id");
            e.Property(d => d.UserId).HasColumnName("userid");
            e.Property(d => d.Game).HasColumnName("game");
            e.Property(d => d.ChallengeDate).HasColumnName("challengedate");
            e.Property(d => d.Value).HasColumnName("value");
            e.Property(d => d.CreatedAt).HasColumnName("createdat");
            e.HasOne(d => d.User).WithMany().HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(d => new { d.UserId, d.Game, d.ChallengeDate }).IsUnique();
        });
    }
}
