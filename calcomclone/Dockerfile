FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS backend-build
WORKDIR /src/backend
COPY src/backend/ .
RUN dotnet publish CalComClone.WebApi/CalComClone.WebApi.csproj -c Release -o /app/backend

FROM node:22-alpine AS frontend-build
WORKDIR /src/frontend
COPY src/frontend/package.json src/frontend/package-lock.json ./
RUN npm ci
COPY src/frontend/ .
RUN VITE_API_BASE_URL= npm run build

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine
WORKDIR /app
COPY --from=backend-build /app/backend .
COPY --from=frontend-build /src/frontend/dist ./wwwroot
EXPOSE 8080
ENTRYPOINT ["dotnet", "CalComClone.WebApi.dll"]
