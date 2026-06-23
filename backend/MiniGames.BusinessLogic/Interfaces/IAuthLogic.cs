using MiniGames.Domains.Models.Auth;
using MiniGames.Domains.Models.User;

namespace MiniGames.BusinessLogic.Interfaces;

public interface IAuthLogic
{
    Task<AuthResponse> LoginAsync(LoginRequest request, string ip);
    Task<AuthResponse> RegisterAsync(RegisterRequest request, string ip);
    Task<AuthResponse> RefreshAsync(string refreshToken, string ip);
    Task LogoutAsync(string refreshToken);
    Task<UserDto?> GetMeAsync(Guid userId);
}
