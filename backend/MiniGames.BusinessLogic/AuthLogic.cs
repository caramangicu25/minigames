using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MiniGames.BusinessLogic.Interface;
using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.DTOs.Auth;
using MiniGames.Domains.DTOs.User;
using MiniGames.Domains.Entities;

namespace MiniGames.BusinessLogic;

public class AuthLogic : IAuthLogic
{
    private readonly UserRepository _users = new();
    private readonly RefreshTokenRepository _tokens = new();

    public async Task<AuthResponse> LoginAsync(LoginRequest request, string ip)
    {
        var user = await _users.GetByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Account is inactive.");

        return await GenerateAuthResponse(user, ip);
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, string ip)
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

    public async Task<AuthResponse> RefreshAsync(string refreshToken, string ip)
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

    public async Task LogoutAsync(string refreshToken)
    {
        var token = await _tokens.GetAsync(refreshToken);
        if (token is not null) await _tokens.DeleteAsync(token.Id);
    }

    public async Task<UserDto?> GetMeAsync(Guid userId)
    {
        var user = await _users.GetByIdAsync(userId);
        return user is null ? null : ToDto(user);
    }

    private async Task<AuthResponse> GenerateAuthResponse(User user, string ip)
    {
        var expiry = DateTime.UtcNow.AddMinutes(JwtOptionsHolder.AccessTokenMinutes);
        var accessToken = CreateJwt(user, expiry);

        var refresh = new RefreshToken
        {
            UserId = user.Id,
            Token = GenerateRefreshToken(),
            CreatedByIp = ip,
            ExpiresAt = DateTime.UtcNow.AddDays(JwtOptionsHolder.RefreshTokenDays),
        };
        await _tokens.AddAsync(refresh);

        return new AuthResponse(accessToken, "Bearer", expiry, ToDto(user));
    }

    private static string CreateJwt(User user, DateTime expiry)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtOptionsHolder.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("username", user.Username),
            new Claim("stamp", user.SecurityStamp),
        };
        var token = new JwtSecurityToken(
            issuer: JwtOptionsHolder.Issuer,
            audience: JwtOptionsHolder.Audience,
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

public static class JwtOptionsHolder
{
    public static string Key { get; set; } = string.Empty;
    public static string Issuer { get; set; } = string.Empty;
    public static string Audience { get; set; } = string.Empty;
    public static int AccessTokenMinutes { get; set; } = 15;
    public static int RefreshTokenDays { get; set; } = 7;
}
