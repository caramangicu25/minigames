namespace MiniGames.Api.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddMiniGamesCors(this IServiceCollection services, IConfiguration config)
    {
        var frontend = config["Frontend"] ?? "http://localhost:3000";
        services.AddCors(o => o.AddDefaultPolicy(p =>
            p.WithOrigins(frontend)
             .AllowAnyMethod()
             .AllowAnyHeader()
             .AllowCredentials()));
        return services;
    }
}
