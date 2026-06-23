using MiniGames.BusinessLogic.Structure;
using Xunit;

namespace MiniGames.Tests;

public class AuthLogicTests
{
    [Fact]
    public void JwtSettings_DefaultValues_AreSet()
    {
        JwtSettings.Key = "test-key-min-32-chars-long-secret";
        JwtSettings.Issuer = "test";
        JwtSettings.Audience = "test";

        Assert.Equal("test-key-min-32-chars-long-secret", JwtSettings.Key);
        Assert.Equal(15, JwtSettings.AccessTokenMinutes);
        Assert.Equal(7, JwtSettings.RefreshTokenDays);
    }
}
