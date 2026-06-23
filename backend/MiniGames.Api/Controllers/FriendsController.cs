using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniGames.Api.Extensions;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Friends;
using BL = MiniGames.BusinessLogic.BusinessLogic;

namespace MiniGames.Api.Controllers;

[ApiController]
[Route("api/friends")]
[Authorize]
public class FriendsController : ControllerBase
{
    private readonly IFriendLogic _logic;
    private readonly IAchievementLogic _achievements;

    public FriendsController()
    {
        var bl = new BL();
        _logic = bl.FriendAction();
        _achievements = bl.AchievementAction();
    }

    [HttpGet]
    public async Task<IActionResult> GetFriends()
    {
        var userId = User.GetUserId();
        var friends = await _logic.GetFriendsAsync(userId);
        return Ok(friends);
    }

    [HttpPost("request")]
    public async Task<IActionResult> SendRequest([FromBody] SendFriendRequestDto dto)
    {
        var userId = User.GetUserId();
        try
        {
            var result = await _logic.SendRequestAsync(userId, dto.Username);
            await _achievements.UnlockFriendAchievementAsync(userId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id:guid}/respond")]
    public async Task<IActionResult> Respond(Guid id, [FromQuery] bool accept)
    {
        var ok = await _logic.RespondAsync(id, accept);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Remove(Guid id)
    {
        var ok = await _logic.RemoveAsync(id);
        return ok ? NoContent() : NotFound();
    }

    [HttpGet("leaderboard")]
    public async Task<IActionResult> FriendLeaderboard()
    {
        var userId = User.GetUserId();
        var entries = await _logic.GetFriendLeaderboardAsync(userId);
        return Ok(entries);
    }
}
