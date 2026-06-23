using MiniGames.BusinessLogic.Core;
using MiniGames.BusinessLogic.Interfaces;
using MiniGames.Domains.Models.User;

namespace MiniGames.BusinessLogic.Structure;

public class UserActionExecution : UserActions, IUserLogic
{
    public async Task<UserDto?> GetByIdAsync(Guid id)
        => await GetByIdActionExecution(id);

    public async Task<List<UserDto>> GetAllAsync()
        => await GetAllActionExecution();

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserRequest request)
        => await UpdateActionExecution(id, request);

    public async Task<bool> DeleteAsync(Guid id)
        => await DeleteActionExecution(id);
}
