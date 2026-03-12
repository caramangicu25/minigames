using MiniGames.Domains.DTOs.User;

namespace MiniGames.BusinessLogic.Interface;

public interface IUserLogic
{
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<List<UserDto>> GetAllAsync();
    Task<UserDto?> UpdateAsync(Guid id, UpdateUserRequest request);
    Task<bool> DeleteAsync(Guid id);
}
