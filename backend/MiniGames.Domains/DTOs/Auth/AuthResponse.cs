using MiniGames.Domains.DTOs.User;

namespace MiniGames.Domains.DTOs.Auth;

public record AuthResponse(
    string Token,
    string TokenType,
    DateTime ExpiresAtUtc,
    UserDto User
);
