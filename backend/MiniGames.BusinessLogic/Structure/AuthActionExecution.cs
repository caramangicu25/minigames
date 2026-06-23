using MiniGames.BusinessLogic.Core;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.Auth;
using MiniGames.Domains.Models.User;

namespace MiniGames.BusinessLogic.Structure;

public class AuthActionExecution : AuthActions, IAuthLogic
{
    public async Task<AuthResponse> LoginAsync(LoginRequest request, string ip)
        => await LoginActionExecution(request, ip);

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, string ip)
        => await RegisterActionExecution(request, ip);

    public async Task<AuthResponse> RefreshAsync(string refreshToken, string ip)
        => await RefreshActionExecution(refreshToken, ip);

    public async Task LogoutAsync(string refreshToken)
        => await LogoutActionExecution(refreshToken);

    public async Task<UserDto?> GetMeAsync(Guid userId)
        => await GetMeActionExecution(userId);
}
