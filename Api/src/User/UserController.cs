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
    // VALIDATION within 'UserPayloadSignup'
    ////

    // HASHING -> payload Password
    ////

    var payloadHasher = new PasswordHasher<UserPayloadSignup>(); //
    string payloadPasswordHashed = payloadHasher.HashPassword(payload, payload.Password);

    // DB Repo
    ////

    // payload -> model
    User model = new() {
      Id = Guid.CreateVersion7(),
      Email = payload.Email,
      Password = payloadPasswordHashed,
      Name = payload.Name,
      Created = DateTimeOffset.UtcNow,
      Roles = ["User"]
    };

    // VALIDATE model Password
    ////

    var entityHasher = new PasswordHasher<User>();
    var entityPasswordHashVerifiy = entityHasher.VerifyHashedPassword(model, model.Password, payload.Password);
    if (entityPasswordHashVerifiy != PasswordVerificationResult.Success) {
      var securityErr = new DtoResponse<object>([], "Error en el registro de Usuario.");
      return StatusCode(StatusCodes.Status500InternalServerError, securityErr);
    }

    // VALIDATE entity
    ////

    User? entity = _userRepoSrv.Create(model);
    if (entity == null) {
      var modelErr = new DtoResponse<object>([], "Usuario ya registrado.");
      return StatusCode(StatusCodes.Status409Conflict, modelErr);
    }

    // RES
    ////

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

    User[] entities = [.. _userRepoSrv.ReadAllByRoles(lowerRoles)]; // clone model[]

    // RES
    ////

    // entity -> dto
    DtoUser[] items = [];
    if (entities.Length > 0) {
      items = [.. entities.Select(user =>
        new DtoUser(
          Id: user.Id,
          Email: user.Email,
          Name: user.Name,
          Roles: user.Roles
        )
      )];
    }

    // dto
    var dto = new DtoResponse<DtoUser>(items, "Lista de usuarios obtenida con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }


  // GET "/users/:id"
  [HttpGet("{id:Guid}")]
  [Authorize(Roles = $"{nameof(UserRole.Admin)}, {nameof(UserRole.Super)}, {nameof(UserRole.User)}")]
  public ActionResult<DtoResponse<DtoUser>> ProfileRead(Guid id) {
    // VALIDATION within 'id:Guid'
    ////

    // DB Repo
    ////

    // path var -> entity
    User? targetUser = _userRepoSrv.ReadById(id);
    if (targetUser == null) {
      var entityErr = new DtoResponse<DtoUser>([], "Usuario no encontrado.");
      return StatusCode(StatusCodes.Status404NotFound, entityErr);
    }

    // VALIDATE BY ROLE -> authorized 'User' as 'ClaimsPrincipal' inspects its JWT CLAIMS
    ////

    string loggedUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    DtoResponse<DtoUser>? resErr = null;

    // Role 'User'  can READ ONLY itself
    // Role 'Admin' can READ itself + rol 'User'
    // Role 'Super' can READ ALL roles (there's only 1 'Super')
    if (User.IsInRole(nameof(UserRole.User)) && loggedUserId != id.ToString())
      resErr = new DtoResponse<DtoUser>([], $"Usuario con rol '{nameof(UserRole.User)}' sólo puede acceder a su propio perfil.");
    else if (User.IsInRole(nameof(UserRole.Admin)) && loggedUserId != id.ToString() && !targetUser.Roles.Contains(nameof(UserRole.User)))
      resErr = new DtoResponse<DtoUser>([], $"Usuario con rol '{nameof(UserRole.Admin)}' sólo puede acceder a su propio perfil o perfiles de rol '{nameof(UserRole.User)}'.");

    if (resErr != null) return StatusCode(StatusCodes.Status403Forbidden, resErr);

    // RES
    ////

    // entity -> dto
    DtoUser[] items = [new DtoUser(Id: targetUser.Id, Email: targetUser.Email, Name: targetUser.Name, Roles: targetUser.Roles)];

    // dto
    var dto = new DtoResponse<DtoUser>(items, "Datos de usuario indagados con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
    // TODO: Create entity AGENDA (many Agendas to 1 User) + migrate DB + return a DtoUserWithAgenda
  }


  // TODO: PATCH "/users/:id"


  // TODO: DELETE "/users/:id"
}

