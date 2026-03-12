using MiniGames.Domains.DTOs.Auth;

namespace MiniGames.BusinessLogic.Interface;

public interface IAuthLogic
{
    Task<AuthResponse> LoginAsync(LoginRequest request, string ip);
    Task<AuthResponse> RegisterAsync(RegisterRequest request, string ip);
    Task<AuthResponse> RefreshAsync(string refreshToken, string ip);
    Task LogoutAsync(string refreshToken);
    Task<Domains.DTOs.User.UserDto?> GetMeAsync(Guid userId);
}
