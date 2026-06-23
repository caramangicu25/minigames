using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniGames.Api.Extensions;
using MiniGames.BusinessLogic.Core;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Achievements;
using BL = MiniGames.BusinessLogic.BusinessLogic;

namespace MiniGames.Api.Controllers;

[ApiController]
[Route("api/achievements")]
public class AchievementsController : ControllerBase
{
    private readonly IAchievementLogic _logic;

    public AchievementsController()
    {
        var bl = new BL();
        _logic = bl.AchievementAction();
    }

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
