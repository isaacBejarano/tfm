using Microsoft.AspNetCore.Mvc;


namespace Api.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class UserController(IUserRepositoryService _userRepoSrv) : ControllerBase {

  // POST /api/user
  [HttpPost]
  public ActionResult<DtoResponse<DtoUser>> Signup([FromBody] DtoUser payload) {
    // VALIDATION within 'DtoUser' //

    // TODO: 2. Repository Pattern CRUD methods
    // https://learn.microsoft.com/en-us/aspnet/web-api/overview/older-versions/creating-a-web-api-that-supports-crud-operations#creating-a-resource

    // TODO: 3. Hash password nativelly!
    // https://learn.microsoft.com/es-es/dotnet/api/microsoft.aspnetcore.identity.passwordhasher-1?view=aspnetcore-9.0
    // var passwordHasher = new PasswordHasher<User>();
    // user.Password = passwordHasher.HashPassword(user, "MiPasswordSeguro123");

    // TODO: 4. Seed users, 1 admin X, 1 admin Tribunal, 1 superadmin me


    // DB REPO //

    // payload dto -> model
    User entity = new() {
      Email = payload.Email,
      Password = payload.Password,
      Name = payload.Name,
    };

    // persist model
    User? success = _userRepoSrv.Create(entity);
    if (success == null) {
      var dtoErr = new DtoResponse<DtoUser>([], "Usuario ya registrado.");
      return StatusCode(StatusCodes.Status409Conflict, dtoErr);
    }

    // DTO //

    // model -> res dto
    DtoUser item = new(
        Id: success.Id,
        Email: success.Email,
        Name: success.Name,
        Password: success.Password
      );

    var dto = new DtoResponse<DtoUser>([item], "Lista de usuarios obtenida con éxito.");
    return StatusCode(StatusCodes.Status201Created, dto);
  }
}

