namespace MiniGames.Domains.Models.Friends;

public record FriendDto(Guid FriendshipId, Guid UserId, string Username, string FullName, string Status, DateTime CreatedAt);
public record SendFriendRequestDto(string Username);
public record FriendLeaderboardEntry(string Username, string Game, double Value, DateTime CreatedAt);
