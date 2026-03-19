using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniGames.Api.Extensions;
using MiniGames.BusinessLogic;
using MiniGames.Domains.DTOs.Achievements;

namespace MiniGames.Api.Controllers;

[ApiController]
[Route("api/achievements")]
public class AchievementsController : ControllerBase
{
    private readonly AchievementLogic _logic = new();

    [HttpGet("all")]
    public IActionResult GetAll() => Ok(AchievementDefinitions.All);

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserAchievements(Guid userId) =>
        Ok(await _logic.GetUserAchievementsAsync(userId));

    [Authorize]
    [HttpPost("check")]
    public async Task<IActionResult> Check([FromBody] CheckAchievementsRequest req)
    {
        var unlocked = await _logic.CheckAndUnlockAsync(req.UserId, req.Game, req.Value);
        return Ok(unlocked);
    }
}
