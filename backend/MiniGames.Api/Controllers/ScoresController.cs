using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniGames.BusinessLogic;
using MiniGames.BusinessLogic.Interface;
using MiniGames.Domains.DTOs.Score;

namespace MiniGames.Api.Controllers;

[ApiController]
[Route("api/scores")]
public class ScoresController : ControllerBase
{
    private readonly IScoreLogic _scores = new ScoreLogic();
    private readonly AchievementLogic _achievements = new();

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
