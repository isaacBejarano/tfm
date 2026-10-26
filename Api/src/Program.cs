global using Api.Database;
global using Api.Dtos;
global using Api.Enums;
global using Api.Interfaces;
global using Api.Models;
global using Api.Repositories;
global using Api.Shared;

using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;


// 1. BUILDER (pattern) //
var builder = WebApplication.CreateBuilder(args);


// 2. SERVICES (Add)
////

// chainable when 'IServiceCollection' returned
builder.Services
  .AddDbContext<SessionContext>()
  .AddScoped<IUserRepositoryService, UserRepositoryService>() // IoC/DI container
  .AddOpenApi() // https://aka.ms/aspnet/openapi
  .AddCors(opts => // policy headers
    opts.AddPolicy("DevPolicies", policy => {
      string[] allowedOrigins = builder.Configuration
        .GetSection("CorsSettings:AllowedOrigins")
        .Get<string[]>()
        ?? [];

      if (allowedOrigins.Length > 0) {
        policy
          .WithOrigins(allowedOrigins) // never use "*" for CORS. Be explicit!
          .AllowAnyHeader()
          .AllowAnyMethod();
      }
    })
  )
  .AddAuthorization()
  .AddAuthentication(opts => {
    // default scheme to use in authentication
    opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; // User requests an endpoint that requires authentication -> ERROR 401 + header 'www-authenticate: bearer'
    opts.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme; // User authenticated without permissions on resource -> ERROR 403
    opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
  })
  .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme,
    opts => {
      opts.SaveToken = true;

      // Identity
      opts.Authority = builder.Configuration["AccessToken:Issuer"];
      opts.Audience = builder.Configuration["AccessToken:Audience"];

      // Token Validation -> Check it is for the app, issued by a trusted Identity Provider (IDP), whose lifetime is in range and was not tampered.
      var accessTokenSecretKey = builder.Configuration["AccessToken:SecretKey"]!;
      opts.TokenValidationParameters = new TokenValidationParameters {
        ValidAudience = builder.Configuration["AccessToken:Audience"], // only Kübello client app
        ValidIssuer = builder.Configuration["AccessToken:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(accessTokenSecretKey)),
        ClockSkew = TimeSpan.Zero, // to set expiry to <= 5 min.
        // validations
        ValidateAudience = true,
        ValidateIssuer = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
      };

      // Context here is 'JwtBearerOptions' and lives before and outside the MVC controllers. Therefore, 'ActionContext' ctx cannot be used here. 'JwtBearerOptions' requires a low-level HTTP response.
      opts.Events = new JwtBearerEvents() {
        // Hook for AuthN CHALLENGE -> ERROR 401
        OnChallenge = async ctx => {
          // headers + DTO
          ctx.HandleResponse(); // skip default .NET res
          ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
          ctx.Response.ContentType = "application/json";
          ctx.Response.Headers.Append("WWW-Authenticate", "Bearer");
          var dto = new DtoResponse<object>([], "Usuario no autenticado.");
          await ctx.Response.WriteAsJsonAsync(dto);
        },
        // Hook for AuthZ FORBID -> ERROR 403
        OnForbidden = async ctx => {
          // AuthN user details
          ClaimsPrincipal ctxUser = ctx.HttpContext.User;
          string userEmail = ctxUser.FindFirst(ClaimTypes.Email)?.Value ?? "";
          string[] userRoles = [.. ctxUser.FindAll(ClaimTypes.Role).Select(role => role.Value)];

          // headers + DTO
          ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
          ctx.Response.ContentType = "application/json";
          string userEmailSubstr = userEmail.Length > 1 ? $"con correo electrónico '{userEmail}'" : "sin correo electrónico";
          string userRolesSubstr = userRoles.Length == 1
            ? $"con rol '{string.Join(", ", userRoles)}'"
            : userRoles.Length > 1
            ? $"con roles '{string.Join(", ", userRoles)}'"
            : "sin roles";
          var dto = new DtoResponse<object>([], $"Usuario {userEmailSubstr} y {userRolesSubstr} no tiene permisos suficientes para acceder a este recurso.");
          await ctx.Response.WriteAsJsonAsync(dto);
        }
      };
    });
// .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
//   opts => builder.Configuration.Bind("RefreshToken", opts)
// ); // 'AuthenticationBuilder' returned

// TODO: JWT -> https://learn.microsoft.com/es-es/aspnet/core/security/authentication/?view=aspnetcore-8.0
// TODO: JWT validations --> https://devblogs.microsoft.com/dotnet/jwt-validation-and-authorization-in-asp-net-core/


// chainable when 'IMvcBuilder ' returned <- last!
builder.Services
  .AddControllers() // MVC
  .ConfigureApiBehaviorOptions(opts =>
    opts.InvalidModelStateResponseFactory = ctx => {
      // traces-free secure client-friendly DTO when client's Bad Requests intercepted
      var errorKinds = ctx.ModelState
        .Where(e => e.Value?.Errors.Count > 0)
        .ToDictionary(
            entry => entry.Key, // e.g. "Email"
            entry => entry.Value!.Errors.Select(err => {
              return entry.Key == "" || entry.Key == "payload"
                ? "Cuerpo de mensaje HTTP requerido."
                : err.ErrorMessage; // e.g. "Campo 'Correo' requerido".
            })
        );
      string Msg = JsonSerializer.Serialize(errorKinds);
      var dto = new DtoResponse<object>([], Msg);
      return new BadRequestObjectResult(dto); // <- IActionResult 400
    }
  );


// 3. API build //
var api = builder.Build();


// 4. MIDDLEWARE (Use)
////

// headers policy
if (api.Environment.IsDevelopment()) { api.UseCors("DevPolicies"); }
else { api.UseCors(); } // Same Origin Policy (SOP)

// [dev mode] -> https priority by order -> launchSettings.json
if (!api.Environment.IsDevelopment()) {
  api.UseHsts(); // hsts-ready browsers
}
api
  .UseHttpsRedirection() // https fallback
  .UseAuthentication() // 1. AuthN -> Call it before any middleware that depends on users being authenticated
  .UseAuthorization() // 2. AuthZ <-> User Roles
  .UseExceptionHandler("/error/500") // 3. last -> "/error/500" (internal, db connection, etc.)
  .UseStatusCodePagesWithReExecute("/error/{0}"); // 4. last -> "/error/404" (unexisting endpoints...)


// .UseRequestLocalization() // TODO: Locale
/* TODO: LOCALE
  https://learn.microsoft.com/en-us/aspnet/core/fundamentals/localization/select-language-culture?view=aspnetcore-10.0

  Client send header 'Accept-Language'
  API also responds header 'Accept-Language'
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language
*/


// 5. ROUTING (Map)
////

// api documentation route (dev only)
if (api.Environment.IsDevelopment()) {
  api.MapOpenApi("swagger/openapi/v1.yaml"); // ctrl (doc) --> route '/swagger/openapi/v1.yaml'
}
// TIP -> debug HTTP with HTTP files instead

api.MapControllers();


// 6. API run //
api.Run();
