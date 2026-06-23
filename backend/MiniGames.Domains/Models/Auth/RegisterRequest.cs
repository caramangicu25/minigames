namespace MiniGames.Domains.Models.Auth;

public record RegisterRequest(
    string Username,
    string FullName,
    string Email,
    string Password
);
