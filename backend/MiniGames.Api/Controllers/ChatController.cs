using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniGames.Api.Extensions;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Chat;
using BL = MiniGames.BusinessLogic.BusinessLogic;

namespace MiniGames.Api.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly IChatLogic _logic;

    public ChatController()
    {
        var bl = new BL();
        _logic = bl.ChatAction();
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages() =>
        Ok(await _logic.GetRecentAsync());

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Send([FromBody] SendMessageRequest req)
    {
        var userId = User.GetUserId();
        var username = User.FindFirst("username")?.Value ?? "unknown";
        try
        {
            var msg = await _logic.SendAsync(userId, username, req.Content);
            return Ok(msg);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _logic.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
