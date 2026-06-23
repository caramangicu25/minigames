using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniGames.Api.Extensions;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Auth;
using BL = MiniGames.BusinessLogic.BusinessLogic;

namespace MiniGames.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthLogic _auth;

    public AuthController()
    {
        var bl = new BL();
        _auth = bl.AuthAction();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var result = await _auth.LoginAsync(request, ip);
            WriteRefreshCookie(result.Token);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var result = await _auth.RegisterAsync(request, ip);
            WriteRefreshCookie(result.Token);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["mg_refresh"];
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new { message = "No refresh token." });

        try
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var result = await _auth.RefreshAsync(refreshToken, ip);
            WriteRefreshCookie(result.Token);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            ClearRefreshCookie();
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["mg_refresh"];
        if (!string.IsNullOrEmpty(refreshToken))
            await _auth.LogoutAsync(refreshToken);

        ClearRefreshCookie();
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.GetUserId();
        var user = await _auth.GetMeAsync(userId);
        return user is null ? NotFound() : Ok(user);
    }

    private void WriteRefreshCookie(string token) =>
        Response.Cookies.Append("mg_refresh", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
        });

    private void ClearRefreshCookie() =>
        Response.Cookies.Delete("mg_refresh");
}
