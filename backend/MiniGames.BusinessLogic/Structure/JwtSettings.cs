namespace MiniGames.BusinessLogic.Structure;

public static class JwtSettings
{
    public static string Key { get; set; } = string.Empty;
    public static string Issuer { get; set; } = string.Empty;
    public static string Audience { get; set; } = string.Empty;
    public static int AccessTokenMinutes { get; set; } = 15;
    public static int RefreshTokenDays { get; set; } = 7;
}
