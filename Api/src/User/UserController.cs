using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UserController(
  IUserRepositoryService _userRepoSrv // DI
  ) : ControllerBase {

  // POST "/users"
  [HttpPost]
  public ActionResult<DtoResponse<object>> Signup([FromBody] UserPayload payload) {
    // VALIDATION within 'UserPayload' //

    // HASHING -> password
    var payloadHasher = new PasswordHasher<UserPayload>(); //
    string payloadPasswordHashed = payloadHasher.HashPassword(payload, payload.Password);


    // DB REPO //

    // payload dto -> model
    User entity = new() {
      Id = Guid.CreateVersion7(),
      Email = payload.Email,
      Password = payloadPasswordHashed,
      Name = payload.Name,
      Created = DateTimeOffset.UtcNow,
      Roles = ["User"]
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


  // GET "/users"
  [HttpGet]
  [Authorize(Roles = $"{nameof(UserRole.Admin)}, {nameof(UserRole.Super)}")]
  public ActionResult<DtoResponse<DtoUser>> List() {
    // AUTH -> global config as middleware

    // 'ClaimsPrincipal' inherited, to filter User List in DTO
    ClaimsPrincipal ctxUser = User;
    // TODO: encapsulate into SRV
    UserRole[] targetRoles = User.IsInRole(nameof(UserRole.Super))
      ? [UserRole.Admin, UserRole.User]
      : User.IsInRole(nameof(UserRole.Admin))
      ? [UserRole.User]
      : [];

    // DB REPO //
    User[] users = [.. _userRepoSrv.ReadAllByRoles(targetRoles)]; // clone

    // DTO //

    // model -> res dto
    DtoUser[] items = [];
    if (users.Length > 0) {
      items = [.. users.Select(user =>
        new DtoUser(
          Id: user.Id,
          Email: user.Email,
          Name: user.Name,
          Roles: user.Roles
        )
      )];
    }
    var dto = new DtoResponse<DtoUser>(items, "Lista de usuarios obtenida con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }


  // GET "/users/:id"
  [HttpGet("{id:Guid}")]
  [Authorize(Roles = $"{nameof(UserRole.User)}, {nameof(UserRole.Admin)}, {nameof(UserRole.Super)}")]
  public ActionResult<DtoResponse<DtoUser>> Profile(Guid id) {
    // VALIDATION within 'DtoId' //

    // DB REPO //

    User? user = _userRepoSrv.ReadById(id);
    if (user == null) {
      var dtoErr = new DtoResponse<DtoUser>([], "Usuario no encontrado.");
      return StatusCode(StatusCodes.Status404NotFound, dtoErr);
    }

    // TODO:
    // if payload User Email === JWT Email && both Emails exist --> self editing
    // else && both Emails exist --> Admin editing a User, XOR Super editing an Admin

    // DTO //

    // model -> res dto
    DtoUser item = new(
      Id: user.Id,
      Email: user.Email,
      Name: user.Name,
      Roles: user.Roles
    );

    // FIXME: create entity AGENDA (many Agendas to 1 User) + migrate DB + return a DtoUserWithAgenda
    var dto = new DtoResponse<DtoUser>([item], "Datos de usuario obtenidos con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }


}

