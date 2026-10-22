global using Api.Database;
global using Api.Dtos;
global using Api.Interfaces;
global using Api.Models;
global using Api.Repositories;
global using Api.Shared;
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
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(opts => {
    var issuerSigningKey = builder.Configuration["AccessToken:SecretKey"]!;
    // Token Validation has multiple parts. The token is validated by checking that it is for the application, that it was issued by a trusted Identity Provider (IDP), that the token's lifetime is in range, and that it was not tampered with
    opts.TokenValidationParameters = new TokenValidationParameters {
      ValidIssuer = builder.Configuration["AccessToken:Issuer"],
      ValidAudience = builder.Configuration["AccessToken:Audience"], // only Kübello client app
      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(issuerSigningKey)),
      // validations
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateLifetime = true,
      ValidateIssuerSigningKey = true,
    };
  }); // 'AuthenticationBuilder' returned

// TODO: JWT -> https://learn.microsoft.com/es-es/aspnet/core/security/authentication/?view=aspnetcore-8.0
// TODO: JWT validations --> https://devblogs.microsoft.com/dotnet/jwt-validation-and-authorization-in-asp-net-core/


// chainable when 'IMvcBuilder ' returned <- last!
builder.Services
  .AddControllers() // MVC
  .ConfigureApiBehaviorOptions(opts =>
    opts.InvalidModelStateResponseFactory = ctx => {
      // traces-free secure client-friendly DTO when client's Bad Requests interdepted
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

// error handler redirects
api
  .UseExceptionHandler("/error/500") // -> "/error/500" (internal, db connection, etc.)
  .UseStatusCodePagesWithReExecute("/error/{0}"); // -> "/error/404" (unexisting endpoints...)

// headers policy
if (api.Environment.IsDevelopment()) { api.UseCors("DevPolicies"); }
else { api.UseCors(); } // Same Origin Policy (SOP)

// [dev mode] -> https priority by order -> launchSettings.json
if (!api.Environment.IsDevelopment()) {
  api.UseHsts(); // hsts-ready browsers
}
api
  .UseHttpsRedirection() // https fallback
  .UseRequestLocalization() // TODO: Locale
  .UseAuthentication() // 1. Authn
  .UseAuthorization(); // 2. Authz


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
