using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace Api.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class UserController(IUserRepositoryService _userRepoSrv) : ControllerBase {

  // POST "/user"
  [HttpPost]
  public ActionResult<DtoResponse<DtoUser>> Signup([FromBody] DtoUser payload) {
    // VALIDATION within 'DtoUser' //

    // TODO: 3. Hash password nativelly!
    // https://learn.microsoft.com/es-es/dotnet/api/microsoft.aspnetcore.identity.passwordhasher-1?view=aspnetcore-9.0
    // var passwordHasher = new PasswordHasher<User>();
    // user.Password = passwordHasher.HashPassword(user, "MiPasswordSeguro123");

    // TODO: 4. Seed users, 1 admin X, 1 admin Tribunal, 1 superadmin me


    // HASHING
    var hashingOpts = new PasswordHasherOptions();
    var userDtoHasher = new PasswordHasher<DtoUser>();
    string passwordHashed = userDtoHasher.HashPassword(payload, payload.Password);

    // DB REPO //

    // payload dto -> model
    User entity = new() {
      Email = payload.Email,
      Password = payload.Password,
      Name = payload.Name,
    };



    // persist model
    User? user = _userRepoSrv.Create(entity);
    if (user == null) {
      var dtoErr = new DtoResponse<DtoUser>([], "Usuario ya registrado.");
      return StatusCode(StatusCodes.Status409Conflict, dtoErr);
    }

    // DTO //

    // model -> res dto
    DtoUser item = new(
        Id: user.Id,
        Email: user.Email,
        Name: user.Name,
        Password: user.Password);

    var dto = new DtoResponse<DtoUser>([item], "Usuario registrado con éxito.");
    return StatusCode(StatusCodes.Status201Created, dto);
  }


  // GET "/api/user"
  [HttpGet]
  public ActionResult<DtoResponse<DtoUser>> List() {
    // TODO: AUTH + API filters DTO by Token claim "role" (no payload, no query param)

    // DB REPO //

    User[] users = [.. _userRepoSrv.ReadAll()];

    // DTO //

    // model -> res dto
    DtoUser[] items = [];
    if (users.Length > 0) {
      items = [.. users.Select(user =>
        new DtoUser(
          Id: user.Id,
          Email: user.Email,
          Name: user.Name,
          Password: user.Password
        )
      )];
    }

    var dto = new DtoResponse<DtoUser>(items, "Lista de usuarios obtenida con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }


  // GET "/api/user/:id"
  [HttpGet("{id}")]
  public ActionResult<DtoResponse<DtoUser>> Profile(Guid id) {
    // VALIDATION within 'DtoId' //

    // TODO: AUTH + API filters DTO by Token claim "role" (no payload, no query param)


    // DB REPO //

    User? user = _userRepoSrv.ReadById(id);
    if (user == null) {
      var dtoErr = new DtoResponse<DtoUser>([], "Usuario no encontrado.");
      return StatusCode(StatusCodes.Status404NotFound, dtoErr);
    }

    // DTO //

    // model -> res dto
    var item = new DtoUser(
        Id: user.Id,
        Email: user.Email,
        Name: user.Name,
        Password: user.Password
      );


    var dto = new DtoResponse<DtoUser>([item], "Datos de usuario obtenidos con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }

  // [HttpGet("int/{id:int}")] // GET /api/test2/int/3
  // https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-10.0

}

