using MiniGames.DataAccess.Repositories;
using MiniGames.Domains.Models.User;

namespace MiniGames.BusinessLogic.Core;

public class UserActions
{
    protected UserActions() { }

    private readonly UserRepository _users = new();

    protected async Task<UserDto?> GetByIdActionExecution(Guid id)
    {
        var user = await _users.GetByIdAsync(id);
        return user is null ? null : new UserDto(user.Id, user.Username, user.FullName, user.Email, user.CreatedAt, user.IsActive);
    }

    protected async Task<List<UserDto>> GetAllActionExecution()
    {
        var users = await _users.GetAllAsync();
        return users.Select(u => new UserDto(u.Id, u.Username, u.FullName, u.Email, u.CreatedAt, u.IsActive)).ToList();
    }

    protected async Task<UserDto?> UpdateActionExecution(Guid id, UpdateUserRequest request)
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

    protected async Task<bool> DeleteActionExecution(Guid id) => await _users.DeleteAsync(id);
}
