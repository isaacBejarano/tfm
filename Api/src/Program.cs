global using Api.Shared;


// 1. BUILDER (pattern) //
var builder = WebApplication.CreateBuilder(args);


// 2. SERVICES (Add)
////

builder
  .Services.AddControllers()
  .Services.AddOpenApi(); // https://aka.ms/aspnet/openapi


// 3. API instance //
var api = builder.Build();


// 4. Middleware HTTP (Use)
////

api
  // .UseHttpsRedirection()
  .UseAuthorization()
  .UseRequestLocalization();
/* TODO: LOCALE
  https://learn.microsoft.com/en-us/aspnet/core/fundamentals/localization/select-language-culture?view=aspnetcore-10.0

  Client send header 'Accept-Language'
  API also responds header 'Accept-Language'
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language
*/

// 3. Routing (Map)
////

// api documentation route (dev only)
if (api.Environment.IsDevelopment()) { api.MapOpenApi(); }
// TODO: Don't use OpenAPI Swagger
// - Debug HTTP with HTTP files instead
// - Test Endpoints with Angular directly

// TODO: "api/v1" prefix
api.MapControllers();


// 5. API entrypoint //
api.Run();

