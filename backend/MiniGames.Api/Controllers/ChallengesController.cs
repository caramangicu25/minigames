using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniGames.Api.Extensions;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Challenges;
using BL = MiniGames.BusinessLogic.BusinessLogic;

namespace MiniGames.Api.Controllers;

[ApiController]
[Route("api/challenges")]
public class ChallengesController : ControllerBase
{
    private readonly IChallengeLogic _logic;

    public ChallengesController()
    {
        var bl = new BL();
        _logic = bl.ChallengeAction();
    }

    [HttpGet("leaderboard/{game}")]
    public async Task<IActionResult> GetLeaderboard(string game) =>
        Ok(await _logic.GetTodayLeaderboardAsync(game));

    [Authorize]
    [HttpGet("status/{game}")]
    public async Task<IActionResult> GetStatus(string game)
    {
        var userId = User.GetUserId();
        var submitted = await _logic.HasSubmittedTodayAsync(userId, game);
        return Ok(new { submitted });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SubmitChallengeRequest req)
    {
        var userId = User.GetUserId();
        try
        {
            var entry = await _logic.SubmitAsync(userId, req.Game, req.Value);
            return Ok(entry);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }
}
