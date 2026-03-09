namespace MiniGames.Domains.DTOs.User;

public record UpdateUserRequest(
    string? FullName,
    string? Username
);
