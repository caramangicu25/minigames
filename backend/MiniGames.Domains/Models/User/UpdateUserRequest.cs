namespace MiniGames.Domains.Models.User;

public record UpdateUserRequest(
    string? FullName,
    string? Username
);
