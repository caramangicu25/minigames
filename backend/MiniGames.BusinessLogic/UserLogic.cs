using MiniGames.BusinessLogic.Interface;
using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.DTOs.User;

namespace MiniGames.BusinessLogic;

public class UserLogic : IUserLogic
{
    private readonly UserRepository _users = new();

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await _users.GetByIdAsync(id);
        return user is null ? null : new UserDto(user.Id, user.Username, user.FullName, user.Email, user.CreatedAt, user.IsActive);
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        var users = await _users.GetAllAsync();
        return users.Select(u => new UserDto(u.Id, u.Username, u.FullName, u.Email, u.CreatedAt, u.IsActive)).ToList();
    }

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserRequest request)
    {
        var user = await _users.GetByIdAsync(id);
        if (user is null) return null;

        if (request.FullName is not null) user.FullName = request.FullName;
        if (request.Username is not null)
        {
            var existing = await _users.GetByUsernameAsync(request.Username);
            if (existing is not null && existing.Id != id)
                throw new InvalidOperationException("Username is already taken.");
            user.Username = request.Username;
        }

        await _users.UpdateAsync(user);
        return new UserDto(user.Id, user.Username, user.FullName, user.Email, user.CreatedAt, user.IsActive);
    }

    public async Task<bool> DeleteAsync(Guid id) => await _users.DeleteAsync(id);
}
