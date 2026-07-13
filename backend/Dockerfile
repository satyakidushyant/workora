FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["Workora.slnx", "./"]
COPY ["src/Workora.API/Workora.API.csproj", "src/Workora.API/"]
COPY ["src/Workora.Application/Workora.Application.csproj", "src/Workora.Application/"]
COPY ["src/Workora.Domain/Workora.Domain.csproj", "src/Workora.Domain/"]
COPY ["src/Workora.Infrastructure/Workora.Infrastructure.csproj", "src/Workora.Infrastructure/"]
COPY ["src/Workora.Persistence/Workora.Persistence.csproj", "src/Workora.Persistence/"]
COPY ["src/Workora.Shared/Workora.Shared.csproj", "src/Workora.Shared/"]

# Restore dependencies
RUN dotnet restore "src/Workora.API/Workora.API.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/src/Workora.API"

# Build and publish
RUN dotnet build "Workora.API.csproj" -c Release -o /app/build
RUN dotnet publish "Workora.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Run as non-root user
USER $APP_UID

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Workora.API.dll"]
