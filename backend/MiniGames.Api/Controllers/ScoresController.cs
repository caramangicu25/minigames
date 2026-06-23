using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Score;
using BL = MiniGames.BusinessLogic.BusinessLogic;

namespace MiniGames.Api.Controllers;

[ApiController]
[Route("api/scores")]
public class ScoresController : ControllerBase
{
    private readonly IScoreLogic _scores;
    private readonly IAchievementLogic _achievements;

    public ScoresController()
    {
        var bl = new BL();
        _scores = bl.ScoreAction();
        _achievements = bl.AchievementAction();
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SubmitScoreRequest request)
    {
        try
        {
            var score = await _scores.SubmitAsync(request);
            var unlocked = await _achievements.CheckAndUnlockAsync(request.UserId, request.Game, request.Value);
            return Ok(new { score, unlocked });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("leaderboard")]
    public async Task<IActionResult> Leaderboard([FromQuery] string? game) =>
        Ok(await _scores.GetLeaderboardAsync(game));

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetByUser(Guid userId) =>
        Ok(await _scores.GetByUserAsync(userId));
}
