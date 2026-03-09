namespace MiniGames.Domains.DTOs.User;

public record UserDto(
    Guid Id,
    string Username,
    string FullName,
    string Email,
    DateTime CreatedAt,
    bool IsActive
);
