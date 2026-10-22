using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace Api.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class UserController(
  IUserRepositoryService _userRepoSrv // DI
  ) : ControllerBase {

  // POST "/user"
  [HttpPost]
  public ActionResult<DtoResponse<object>> Signup([FromBody] DtoUser payload) {
    // VALIDATION within 'DtoUser' //


    // HASHING -> password
    var payloadHasher = new PasswordHasher<DtoUser>(); //
    string payloadPasswordHashed = payloadHasher.HashPassword(payload, payload.Password);


    // DB REPO //

    // payload dto -> model
    User entity = new() {
      Id = Guid.CreateVersion7(),
      Email = payload.Email,
      Password = payloadPasswordHashed,
      Name = payload.Name,
      Created = DateTimeOffset.UtcNow
    };

    var entityHasher = new PasswordHasher<User>();
    var entityPasswordHashVerifiy = entityHasher.VerifyHashedPassword(entity, entity.Password, payload.Password);

    if (entityPasswordHashVerifiy != PasswordVerificationResult.Success) {
      var dtoErr = new DtoResponse<object>([], "Error en el registro de Usuario.");
      return StatusCode(StatusCodes.Status500InternalServerError, dtoErr);
    }

    // persist model
    User? user = _userRepoSrv.Create(entity);

    if (user == null) {
      var dtoErr = new DtoResponse<object>([], "Usuario ya registrado.");
      return StatusCode(StatusCodes.Status409Conflict, dtoErr);
    }


    // DTO -> no item here; security policy
    var dto = new DtoResponse<object>([], "Usuario registrado con éxito.");
    return StatusCode(StatusCodes.Status201Created, dto);
  }


  // GET "/api/user"
  [HttpGet]
  [Authorize(Roles = "super,admin")]
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
  [HttpGet("{id:Guid}")]
  [Authorize(Roles = "super,admin,user")]
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

  // TODO: check path variable checkin
  // [HttpGet("int/{id:int}")] // GET /api/test2/int/3
  // https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-10.0

}

