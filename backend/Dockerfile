FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["MiniGames.Api/MiniGames.Api.csproj", "MiniGames.Api/"]
COPY ["MiniGames.BusinessLogic/MiniGames.BusinessLogic.csproj", "MiniGames.BusinessLogic/"]
COPY ["MiniGames.DataAccess/MiniGames.DataAccess.csproj", "MiniGames.DataAccess/"]
COPY ["MiniGames.Domains/MiniGames.Domains.csproj", "MiniGames.Domains/"]

RUN dotnet restore "MiniGames.Api/MiniGames.Api.csproj"

COPY . .
RUN dotnet publish "MiniGames.Api/MiniGames.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "MiniGames.Api.dll"]
