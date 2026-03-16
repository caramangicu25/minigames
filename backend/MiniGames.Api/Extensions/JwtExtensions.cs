using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MiniGames.BusinessLogic;
using MiniGames.DataAccess;

namespace MiniGames.Api.Extensions;

public static class JwtExtensions
{
    public static IServiceCollection AddMiniGamesJwt(this IServiceCollection services, IConfiguration config)
    {
        var jwtSection = config.GetSection("Jwt");
        var key = jwtSection["Key"] ?? throw new InvalidOperationException("JWT Key is missing.");
        var issuer = jwtSection["Issuer"] ?? "minigames-api";
        var audience = jwtSection["Audience"] ?? "minigames-client";
        var accessMin = int.TryParse(jwtSection["AccessTokenMinutes"], out var a) ? a : 15;
        var refreshDays = int.TryParse(jwtSection["RefreshTokenDays"], out var r) ? r : 7;

        JwtOptionsHolder.Key = key;
        JwtOptionsHolder.Issuer = issuer;
        JwtOptionsHolder.Audience = audience;
        JwtOptionsHolder.AccessTokenMinutes = accessMin;
        JwtOptionsHolder.RefreshTokenDays = refreshDays;

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(o =>
            {
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                    ClockSkew = TimeSpan.FromMinutes(1),
                    NameClaimType = ClaimTypes.NameIdentifier,
                };

                o.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async ctx =>
                    {
                        var userId = ctx.Principal?.FindFirstValue(ClaimTypes.NameIdentifier)
                                  ?? ctx.Principal?.FindFirstValue("sub");
                        if (!Guid.TryParse(userId, out var id))
                        {
                            ctx.Fail("Invalid token");
                            return;
                        }
                        await using var db = DbSession.Create();
                        var user = await db.Users.FindAsync(id);
                        if (user is null || !user.IsActive)
                            ctx.Fail("User inactive or not found");
                    },
                };
            });

        services.AddAuthorization();
        return services;
    }
}
