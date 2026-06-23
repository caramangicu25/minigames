using MiniGames.BusinessLogic.Core;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Friends;

namespace MiniGames.BusinessLogic.Structure;

public class FriendActionExecution : FriendActions, IFriendLogic
{
    public async Task<FriendDto> SendRequestAsync(Guid requesterId, string addresseeUsername)
        => await SendRequestActionExecution(requesterId, addresseeUsername);

    public async Task<bool> RespondAsync(Guid friendshipId, bool accept)
        => await RespondActionExecution(friendshipId, accept);

    public async Task<bool> RemoveAsync(Guid friendshipId)
        => await RemoveActionExecution(friendshipId);

    public async Task<List<FriendDto>> GetFriendsAsync(Guid userId)
        => await GetFriendsActionExecution(userId);

    public async Task<List<FriendLeaderboardEntry>> GetFriendLeaderboardAsync(Guid userId)
        => await GetFriendLeaderboardActionExecution(userId);
}
