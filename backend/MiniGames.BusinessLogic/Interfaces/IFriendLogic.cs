using MiniGames.Domains.Models.Friends;

namespace MiniGames.BusinessLogic.Interfaces;

public interface IFriendLogic
{
    Task<FriendDto> SendRequestAsync(Guid requesterId, string addresseeUsername);
    Task<bool> RespondAsync(Guid friendshipId, bool accept);
    Task<bool> RemoveAsync(Guid friendshipId);
    Task<List<FriendDto>> GetFriendsAsync(Guid userId);
    Task<List<FriendLeaderboardEntry>> GetFriendLeaderboardAsync(Guid userId);
}
