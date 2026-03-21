using MiniGames.BusinessLogic;
using Xunit;

namespace MiniGames.Tests;

public class AuthLogicTests
{
    [Fact]
    public void JwtOptionsHolder_DefaultValues_AreSet()
    {
        JwtOptionsHolder.Key = "test-key-min-32-chars-long-secret";
        JwtOptionsHolder.Issuer = "test";
        JwtOptionsHolder.Audience = "test";

        Assert.Equal("test-key-min-32-chars-long-secret", JwtOptionsHolder.Key);
        Assert.Equal(15, JwtOptionsHolder.AccessTokenMinutes);
        Assert.Equal(7, JwtOptionsHolder.RefreshTokenDays);
    }
}
