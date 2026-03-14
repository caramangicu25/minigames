using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.DTOs.Friends;
using MiniGames.Domains.Entities;

namespace MiniGames.BusinessLogic;

public class FriendLogic
{
    private readonly FriendshipRepository _repo = new();
    private readonly UserRepository _users = new();
    private readonly ScoreRepository _scores = new();

    public async Task<FriendDto> SendRequestAsync(Guid requesterId, string addresseeUsername)
    {
        var addressee = await _users.GetByUsernameAsync(addresseeUsername)
            ?? throw new KeyNotFoundException("User not found.");
        if (addressee.Id == requesterId)
            throw new InvalidOperationException("You cannot add yourself.");
        var existing = await _repo.GetAsync(requesterId, addressee.Id);
        if (existing is not null)
            throw new InvalidOperationException("Friend request already exists.");
        var requester = await _users.GetByIdAsync(requesterId)!;
        var f = new Friendship { RequesterId = requesterId, AddresseeId = addressee.Id };
        await _repo.AddAsync(f);
        return new FriendDto(f.Id, addressee.Id, addressee.Username, addressee.FullName, f.Status, f.CreatedAt);
    }

    public async Task<bool> RespondAsync(Guid friendshipId, bool accept)
        => await _repo.UpdateStatusAsync(friendshipId, accept ? "accepted" : "rejected");

    public async Task<bool> RemoveAsync(Guid friendshipId)
        => await _repo.DeleteAsync(friendshipId);

    public async Task<List<FriendDto>> GetFriendsAsync(Guid userId)
    {
        var all = await _repo.GetAllForUserAsync(userId);
        return all.Select(f =>
        {
            var isRequester = f.RequesterId == userId;
            var friend = isRequester ? f.Addressee : f.Requester;
            return new FriendDto(f.Id, friend.Id, friend.Username, friend.FullName, f.Status, f.CreatedAt);
        }).ToList();
    }

    public async Task<List<FriendLeaderboardEntry>> GetFriendLeaderboardAsync(Guid userId)
    {
        var friendIds = await _repo.GetAcceptedFriendIdsAsync(userId);
        friendIds.Add(userId);
        var results = new List<FriendLeaderboardEntry>();
        foreach (var fid in friendIds)
        {
            var scores = await _scores.GetByUserAsync(fid);
            results.AddRange(scores.Select(s =>
                new FriendLeaderboardEntry(s.User.Username, s.Game, s.Value, s.CreatedAt)));
        }
        return results.OrderByDescending(r => r.Value).Take(20).ToList();
    }
}
