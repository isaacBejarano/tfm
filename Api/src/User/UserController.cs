using Api.Database;
using Api.Dtos;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class UserController(IConfiguration _config) : ControllerBase {

  // POST /api/user
  [HttpPost]
  public ActionResult<DtoResponse<DtoUser>> Signup([FromBody] DtoUser payload) {
    // VALIDATION built-in 'DtoUser'

    // TODO: 2. Hash password nativelly!
    // https://learn.microsoft.com/es-es/dotnet/api/microsoft.aspnetcore.identity.passwordhasher-1?view=aspnetcore-9.0
    // var passwordHasher = new PasswordHasher<User>();
    // user.Password = passwordHasher.HashPassword(user, "MiPasswordSeguro123");

    // Ahora 'user.Password' contendrá una cadena larga y segura lista para guardar en la BD
    // TODO: 3. Repository Pattern CRUD methods
    // https://learn.microsoft.com/es-es/ef/core/get-started/overview/first-app?tabs=netcore-cli#create-read-update--delete
    // TODO: 4. Seed users, 1 admin X, 1 admin Tribunal, 1 superadmin me

    // db ctx
    using var sessionCtx = new SessionContext(_config); // db ctx 'using' --> close connection after usage
    var users = sessionCtx.Users.ToList();

    // CRUD --> create
    if (users.ToArray().Length == 0) {
      // FIXME: SEED
      sessionCtx.Users
      .Add(new User() {
        Email = "Dorofeeva@yopmail.com",
        Password = "patata001",
        Name = "Dorofeeva"
      });
      sessionCtx.Users.Add(new User() {
        Email = "Kola@yopmail.com",
        Password = "patata002",
        Name = "Kola"
      });
      sessionCtx.SaveChanges();
    }

    // CRUD --> read all
    if (users == null) {
      var dtoErr = new DtoResponse<DtoUser>([], "No se pudo acceder a los usuarios.");
      return StatusCode(StatusCodes.Status409Conflict, dtoErr);
    }

    var items = users.Select(record => new DtoUser(
      Id: record.Id,
      Email: record.Email,
      Name: record.Name,
      Password: record.Password
    )).ToArray();

    // DTO
    var dto = new DtoResponse<DtoUser>(items, "Lista de usuarios obtenida con éxito.");
    return StatusCode(StatusCodes.Status201Created, dto);
  }
}

