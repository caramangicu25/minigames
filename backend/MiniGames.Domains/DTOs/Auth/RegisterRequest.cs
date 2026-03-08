namespace MiniGames.Domains.DTOs.Auth;

public record RegisterRequest(
    string Username,
    string FullName,
    string Email,
    string Password
);
