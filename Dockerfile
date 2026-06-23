FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY backend/MiniGames.Api/MiniGames.Api.csproj backend/MiniGames.Api/
COPY backend/MiniGames.BusinessLogic/MiniGames.BusinessLogic.csproj backend/MiniGames.BusinessLogic/
COPY backend/MiniGames.DataAccess/MiniGames.DataAccess.csproj backend/MiniGames.DataAccess/
COPY backend/MiniGames.Domains/MiniGames.Domains.csproj backend/MiniGames.Domains/

RUN dotnet restore backend/MiniGames.Api/MiniGames.Api.csproj

COPY backend/ backend/
RUN dotnet publish backend/MiniGames.Api/MiniGames.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "MiniGames.Api.dll"]
