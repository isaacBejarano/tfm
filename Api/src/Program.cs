global using Api.Shared;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc.ApplicationModels;


// 1. BUILDER (pattern) //
var builder = WebApplication.CreateBuilder(args);


// 2. SERVICES (Add)
////

builder.Services
  .AddOpenApi() // https://aka.ms/aspnet/openapi
  .AddCors(opts => // policy headers
    {
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
      });
    })
  .AddControllers(); // last!


// 3. API instance //
var api = builder.Build();


// 4. Middleware HTTP (Use)
////

// headers policy
if (api.Environment.IsDevelopment()) { api.UseCors("DevPolicies"); }
else { api.UseCors(); } // Same Origin Policy (SOP)

// [dev mode] -> https priority by order -> launchSettings.json
if (!api.Environment.IsDevelopment()) {
  api.UseHsts(); // hsts-ready browsers
}
api
  .UseHttpsRedirection() // fallback
  .UseRequestLocalization() // TODO: Locale
  .UseAuthorization();


/* [LOCALE]
  https://learn.microsoft.com/en-us/aspnet/core/fundamentals/localization/select-language-culture?view=aspnetcore-10.0

  Client send header 'Accept-Language'
  API also responds header 'Accept-Language'
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language
*/

// 3. Routing (Map)
////

// api documentation route (dev only)
if (api.Environment.IsDevelopment()) { api.MapOpenApi(); }
// Debug HTTP with HTTP files

api.MapControllers();


// 5. API entrypoint //
api.Run();

