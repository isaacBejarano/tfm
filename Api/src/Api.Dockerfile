# OCI image - App
####


ARG DOTNET_VERSION=10.0


# STAGE 1 --> Build project to OCI
# .NET SDK image from registry
FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS img-dotnet-sdk
# The real host work directory
WORKDIR /src
# Copy everything (files and folders) from WORKDIR
COPY . ./
# Restore and publish from WITHIN this OCI
RUN dotnet restore src/Api.csproj
RUN dotnet publish src/Api.csproj --configuration Release --output out


# STAGE 2 --> Build runtime to OCI
# .NET Runtime image from registry
FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION} AS img-dotnet-runtime
WORKDIR /src
# Copy from Stage 1 WITHIN this OCI
COPY --from=img-dotnet-sdk /src/out .
ENV ASPNETCORE_HTTP_PORTS=5000
EXPOSE 5000

# Compiled API entrypoint
ENTRYPOINT ["dotnet", "Api.dll"]
