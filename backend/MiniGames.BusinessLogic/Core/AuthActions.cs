using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MiniGames.BusinessLogic.Structure;
using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.Models.Auth;
using MiniGames.Domains.Models.User;
using MiniGames.Domains.Entities;

namespace MiniGames.BusinessLogic.Core;

public class AuthActions
{
    protected AuthActions() { }

    private readonly UserRepository _users = new();
    private readonly RefreshTokenRepository _tokens = new();

    protected async Task<AuthResponse> LoginActionExecution(LoginRequest request, string ip)
    {
        var user = await _users.GetByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Account is inactive.");

        return await GenerateAuthResponse(user, ip);
    }

    protected async Task<AuthResponse> RegisterActionExecution(RegisterRequest request, string ip)
    {
        if (await _users.GetByEmailAsync(request.Email) is not null)
            throw new InvalidOperationException("Email is already in use.");
        if (await _users.GetByUsernameAsync(request.Username) is not null)
            throw new InvalidOperationException("Username is already taken.");

        var user = new User
        {
            Username = request.Username,
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
        };

        await _users.CreateAsync(user);
        return await GenerateAuthResponse(user, ip);
    }

    protected async Task<AuthResponse> RefreshActionExecution(string refreshToken, string ip)
    {
        var token = await _tokens.GetAsync(refreshToken)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");

        if (token.IsExpired)
        {
            await _tokens.DeleteAsync(token.Id);
            throw new UnauthorizedAccessException("Refresh token expired.");
        }

        await _tokens.DeleteAsync(token.Id);
        return await GenerateAuthResponse(token.User, ip);
    }

    protected async Task LogoutActionExecution(string refreshToken)
    {
        var token = await _tokens.GetAsync(refreshToken);
        if (token is not null) await _tokens.DeleteAsync(token.Id);
    }

    protected async Task<UserDto?> GetMeActionExecution(Guid userId)
    {
        var user = await _users.GetByIdAsync(userId);
        return user is null ? null : ToDto(user);
    }

    private async Task<AuthResponse> GenerateAuthResponse(User user, string ip)
    {
        var expiry = DateTime.UtcNow.AddMinutes(JwtSettings.AccessTokenMinutes);
        var accessToken = CreateJwt(user, expiry);

        var refresh = new RefreshToken
        {
            UserId = user.Id,
            Token = GenerateRefreshToken(),
            CreatedByIp = ip,
            ExpiresAt = DateTime.UtcNow.AddDays(JwtSettings.RefreshTokenDays),
        };
        await _tokens.AddAsync(refresh);

        return new AuthResponse(accessToken, "Bearer", expiry, ToDto(user));
    }

    private static string CreateJwt(User user, DateTime expiry)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("username", user.Username),
            new Claim("stamp", user.SecurityStamp),
        };
        var token = new JwtSecurityToken(
            issuer: JwtSettings.Issuer,
            audience: JwtSettings.Audience,
            claims: claims,
            expires: expiry,
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

    private static UserDto ToDto(User u) =>
        new(u.Id, u.Username, u.FullName, u.Email, u.CreatedAt, u.IsActive);
}
