using MiniGames.Domains.Models.User;

namespace MiniGames.Domains.Models.Auth;

public record AuthResponse(
    string Token,
    string TokenType,
    DateTime ExpiresAtUtc,
    UserDto User
);
