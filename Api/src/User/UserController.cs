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
  public ActionResult<DtoResponse<object>> Signup([FromBody] UserPayloadSignup payload) {
    // VALIDATION within 'UserPayloadSignup' //

    // HASHING -> password
    var payloadHasher = new PasswordHasher<UserPayloadSignup>(); //
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
    // Authorized 'User' as 'ClaimsPrincipal' inspects its JWT CLAIMS
    ////

    UserRole[] lowerRoles = User.IsInRole(nameof(UserRole.Super))
      ? [UserRole.Admin, UserRole.User] // Super's lower
      : User.IsInRole(nameof(UserRole.Admin))
      ? [UserRole.User] // Admin's lower
      : [];

    // DB Repo
    ////

    User[] users = [.. _userRepoSrv.ReadAllByRoles(lowerRoles)]; // clone

    // DTO
    ////

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
  [Authorize(Roles = $"{nameof(UserRole.Admin)}, {nameof(UserRole.Super)}, {nameof(UserRole.User)}")]
  public ActionResult<DtoResponse<DtoUser>> ProfileRead(Guid id) {
    // VALIDATION within 'id:Guid'
    ////

    // Authorized 'User' as 'ClaimsPrincipal' inspects its JWT CLAIMS
    ////

    string loggedUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    DtoUser[] items = []; // model -> res dto

    if (User.IsInRole(nameof(UserRole.User))) {
      // Role 'User' can NOT READ 'User' others, 'Admin', 'Super' (all have diff ID)
      ////////

      if (loggedUserId != id.ToString()) {
        var dtoErr = new DtoResponse<DtoUser>([], $"Usuario con rol '{nameof(UserRole.User)}' sólo puede acceder a su propio perfil.");
        return StatusCode(StatusCodes.Status403Forbidden, dtoErr);
      }

      // Role 'User' can ONLY READ itself
      ////////

      User? user = _userRepoSrv.ReadById(id); // DB Repo

      if (user == null) {
        var dtoErr = new DtoResponse<DtoUser>([], "Usuario no encontrado.");
        return StatusCode(StatusCodes.Status404NotFound, dtoErr);
      }

      items = [new DtoUser(Id: user.Id, Email: user.Email, Name: user.Name, Roles: user.Roles)];
    }
    else if (User.IsInRole(nameof(UserRole.Admin))) {
      // Role 'Admin' can READ itself
      ////////

      // Role 'Admin' can READ 'User'
      ////////

      // Role 'Admin' can NOT READ 'Admin' others
      ////////

      // Role 'Admin' can NOT READ 'Super'
      ////////
    }
    else if (User.IsInRole(nameof(UserRole.Super))) {
      // Role 'Super' can READ itself
      ////////

      // Role 'Super' can READ 'User'
      ////////

      // Role 'Super' can READ 'Admin'
      ////////

      // There is only 1 'Super'
      ////////
    }

    // DTO
    ////

    // TODO: Create entity AGENDA (many Agendas to 1 User) + migrate DB + return a DtoUserWithAgenda
    var dto = new DtoResponse<DtoUser>(items, "Datos de usuario indagados con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }

  // TODO: PATCH "/users/:id"
  [HttpPatch("{id:Guid}")]
  [Authorize(Roles = $"{nameof(UserRole.Admin)}, {nameof(UserRole.Super)}, {nameof(UserRole.User)}")]
  public ActionResult<DtoResponse<DtoUser>> ProfileEdit(Guid id, [FromBody] UserPayloadEdit payload) {
    // VALIDATION within 'id:Guid' //

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


  // TODO: DELETE "/users/:id"
}

