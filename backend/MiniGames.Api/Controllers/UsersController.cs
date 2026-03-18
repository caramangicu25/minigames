using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniGames.Api.Extensions;
using MiniGames.BusinessLogic;
using MiniGames.BusinessLogic.Interface;
using MiniGames.Domains.DTOs.User;

namespace MiniGames.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserLogic _users = new UserLogic();

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _users.GetByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateUserRequest request)
    {
        var userId = User.GetUserId();
        try
        {
            var updated = await _users.UpdateAsync(userId, request);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _users.GetAllAsync());

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _users.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
