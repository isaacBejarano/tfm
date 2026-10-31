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
  public ActionResult<ResponseDto<object>> Signup([FromBody] UserPayloadSignup payload) {
    // VALIDATION within 'UserPayloadSignup'
    ////

    // HASHING -> payload Password
    ////

    // TODO: extract hashing into SRV? (for Profile CRUD)

    var payloadHasher = new PasswordHasher<UserPayloadSignup>(); //
    string payloadPasswordHashed = payloadHasher.HashPassword(payload, payload.Password);

    // DB Repo
    ////

    // payload -> model
    User model = new() {
      AgendaIds = [],
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
      var securityErr = new ResponseDto<object>([], "Error en el registro de Usuario.");
      return StatusCode(StatusCodes.Status500InternalServerError, securityErr);
    }

    // VALIDATE entity
    ////

    User? entity = _userRepoSrv.Create(model);
    if (entity == null) {
      var modelErr = new ResponseDto<object>([], "Usuario ya registrado.");
      return StatusCode(StatusCodes.Status409Conflict, modelErr);
    }

    // RES
    ////

    var dto = new ResponseDto<object>([], "Usuario registrado con éxito.");
    return StatusCode(StatusCodes.Status201Created, dto);
  }


  // GET "/users"
  [HttpGet]
  [Authorize(Roles = $"{nameof(UserRole.Admin)}, {nameof(UserRole.Super)}")]
  public ActionResult<ResponseDto<UserDto>> List() {
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
    UserDto[] items = [];
    if (entities.Length > 0) {
      items = [.. entities.Select(user =>
        new UserDto(
          Id: user.Id,
          AgendaIds: [Guid.Empty],
          Email: user.Email,
          Name: user.Name,
          Roles: user.Roles
        )
      )];
    }

    // dto

    // TODO: enxtarct to SRV utility fun (also used i Progrm.cs)
    string[] userRoles = [.. lowerRoles.Select(r => r.ToString())];
    string userRolesSubstr = userRoles.Length == 1
        ? $"con rol '{userRoles[0]}'"
        : userRoles.Length > 1
        ? $"con roles '{string.Join("', '", userRoles)}'"
        : "sin roles";
    var dto = new ResponseDto<UserDto>(items, $"Aceso exitoso a la lista de usuarios {userRolesSubstr}.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }


  // GET "/users/:id"
  [HttpGet("{id:Guid}")]
  [Authorize(Roles = $"{nameof(UserRole.Admin)}, {nameof(UserRole.Super)}, {nameof(UserRole.User)}")]
  public ActionResult<ResponseDto<UserDto>> ProfileRead(Guid id) {
    // VALIDATION within 'id:Guid'
    ////

    // DB Repo
    ////

    // TODO: refactor - exctract Role VALIDATIONS into a Profile SRV?

    // path var -> entity
    User? targetUser = _userRepoSrv.ReadById(id);
    if (targetUser == null) {
      var entityErr = new ResponseDto<UserDto>([], "Usuario no encontrado.");
      return StatusCode(StatusCodes.Status404NotFound, entityErr);
    }

    // VALIDATE BY ROLE -> authorized 'User' as 'ClaimsPrincipal' inspects its JWT CLAIMS
    ////

    string loggedUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    ResponseDto<UserDto>? resErr = null;

    // Role 'User'  can READ ONLY itself
    // Role 'Admin' can READ itself + rol 'User'
    // Role 'Super' can READ ALL roles (there's only 1 'Super')
    if (User.IsInRole(nameof(UserRole.User)) && loggedUserId != targetUser.Id.ToString())
      resErr = new ResponseDto<UserDto>([], $"Usuario con rol '{nameof(UserRole.User)}' sólo puede acceder a su propio perfil.");
    else if (User.IsInRole(nameof(UserRole.Admin)) && loggedUserId != targetUser.Id.ToString() && !targetUser.Roles.Contains(nameof(UserRole.User)))
      resErr = new ResponseDto<UserDto>([], $"Usuario con rol '{nameof(UserRole.Admin)}' sólo puede acceder a su propio perfil o perfiles de rol '{nameof(UserRole.User)}'.");

    if (resErr != null) return StatusCode(StatusCodes.Status403Forbidden, resErr);

    // ITEMS - READ
    ////

    // entity -> dto
    UserDto[] items = [
      new (
        Id: targetUser.Id,
        AgendaIds: [Guid.Empty],
        Email: targetUser.Email,
        Roles: targetUser.Roles,
        Name: targetUser.Name
      )
    ];

    // RES
    ////

    // dto
    var dto = new ResponseDto<UserDto>(items, $"Aceso exitoso al perfil de usuario '{targetUser.Name}'.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }


  // PATCH "/users/:id"
  [HttpPatch("{id:Guid}")]
  [Authorize(Roles = $"{nameof(UserRole.Admin)}, {nameof(UserRole.Super)}, {nameof(UserRole.User)}")]
  public ActionResult<ResponseDto<UserDto>> ProfileUpdate(Guid id, [FromBody] UserPayloadEdit payload) {
    // VALIDATION within 'id:Guid' & 'UserPayloadEdit'
    ////

    // DB Repo
    ////

    // TODO: refactor - exctract Role VALIDATIONS into a Profile SRV?

    // path var -> entity
    User? targetUser = _userRepoSrv.ReadById(id);
    if (targetUser == null) {
      var entityErr = new ResponseDto<UserDto>([], "Usuario no encontrado.");
      return StatusCode(StatusCodes.Status404NotFound, entityErr);
    }

    // VALIDATE BY ROLE -> authorized 'User' as 'ClaimsPrincipal' inspects its JWT CLAIMS
    ////

    string loggedUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    ResponseDto<UserDto>? resErr = null;

    // Role 'User'  can UPDATE ONLY itself
    // Role 'Admin' can UPDATE itself + rol 'User'
    // Role 'Super' can UPDATE ALL roles (there's only 1 'Super')
    if (User.IsInRole(nameof(UserRole.User)) && loggedUserId != targetUser.Id.ToString())
      resErr = new ResponseDto<UserDto>([], $"Usuario con rol '{nameof(UserRole.User)}' sólo puede editar su propio perfil.");
    else if (User.IsInRole(nameof(UserRole.Admin)) && loggedUserId != id.ToString() && !targetUser.Roles.Contains(nameof(UserRole.User)))
      resErr = new ResponseDto<UserDto>([], $"Usuario con rol '{nameof(UserRole.Admin)}' sólo puede editar su propio perfil o perfiles de rol '{nameof(UserRole.User)}'.");

    if (resErr != null) return StatusCode(StatusCodes.Status403Forbidden, resErr);

    // PATCHING
    ////

    // TODO: extract Hashing VALIDATION into SRV? (for Profile CRUD)?

    // payload -> patched class
    UserPatch patch = new() {
      Password = targetUser.Password,
      Name = targetUser.Name
    };

    // Here payload's nulls mean no willing of modifying those fields
    if (payload.Password == null && payload.Name == null) {
      var patchErr = new ResponseDto<UserDto>([], "No se pasó ningún campo de usuario a modificar.");
      return StatusCode(StatusCodes.Status422UnprocessableEntity, patchErr);
    }

    // update UserPatch
    if (payload.Name != null) patch.Name = payload.Name;
    if (payload.Password != null) {
      // HASHING -> payload Password
      ////////
      var payloadHasher = new PasswordHasher<UserPayloadEdit>(); //
      string payloadPasswordHashed = payloadHasher.HashPassword(payload, payload.Password);

      // payload -> patched class
      patch.Password = payloadPasswordHashed;

      // VALIDATE model Password
      ////////

      var patchHasher = new PasswordHasher<UserPatch>();
      var patchPasswordHashVerifiy = patchHasher.VerifyHashedPassword(patch, patch.Password, payload.Password);
      if (patchPasswordHashVerifiy != PasswordVerificationResult.Success) {
        var securityErr = new ResponseDto<object>([], "Credenciales de usuario inválidas.");
        return StatusCode(StatusCodes.Status500InternalServerError, securityErr);
      }
    }

    // ITEMS - UPDATE
    ////

    // patched class -> entity
    User? patchedUser = _userRepoSrv.Patch(id, patch);
    if (patchedUser == null) {
      var patchErr = new ResponseDto<UserDto>([], "No se modificó el usuario.");
      return StatusCode(StatusCodes.Status409Conflict, patchErr);
    }

    // entity -> dto
    UserDto[] items = [
      new (
        Id: patchedUser.Id,
        AgendaIds: [Guid.Empty],
        Email: patchedUser.Email,
        Roles: patchedUser.Roles,
        Name: patchedUser.Name
      )
    ];

    // RES
    ////

    // dto
    var dto = new ResponseDto<UserDto>(items, $"El usuario '{patchedUser.Name}' fue modificado con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }


  // DELETE "/users/:id"
  [HttpDelete("{id:Guid}")]
  [Authorize(Roles = $"{nameof(UserRole.Admin)}, {nameof(UserRole.Super)}, {nameof(UserRole.User)}")]
  public ActionResult<ResponseDto<object>> ProfileDelete(Guid id) {
    // VALIDATION within 'id:Guid'
    ////

    // DB Repo
    ////

    // TODO: refactor - exctract Role VALIDATIONS into a Profile SRV?

    // path var -> entity
    User? targetUser = _userRepoSrv.ReadById(id);
    if (targetUser == null) {
      var entityErr = new ResponseDto<UserDto>([], "Usuario no encontrado.");
      return StatusCode(StatusCodes.Status404NotFound, entityErr);
    }

    // VALIDATE BY ROLE -> authorized 'User' as 'ClaimsPrincipal' inspects its JWT CLAIMS
    ////

    string loggedUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    ResponseDto<UserDto>? resErr = null;

    // Role 'User'  can DELETE ONLY itself
    // Role 'Admin' can DELETE ONLY role 'User'
    // Role 'Super' can DELETE ONLY role 'User'
    if (User.IsInRole(nameof(UserRole.User))
      && loggedUserId != targetUser.Id.ToString()) {
      resErr = new ResponseDto<UserDto>([], $"Usuario con rol '{nameof(UserRole.User)}' sólo puede eliminar su propio perfil.");
    }
    else if ((User.IsInRole(nameof(UserRole.Admin)) || User.IsInRole(nameof(UserRole.Super)))
      && !targetUser.Roles.Contains(nameof(UserRole.User))) {
      resErr = new ResponseDto<UserDto>([], $"Usuario con rol '{nameof(UserRole.Admin)}' o '{nameof(UserRole.Super)}' sólo puede eliminar perfiles de rol '{nameof(UserRole.User)}'.");
    }

    if (resErr != null) return StatusCode(StatusCodes.Status403Forbidden, resErr);

    // ITEMS - DELETION
    ////

    // entity -> bool
    if (!_userRepoSrv.DeleteHard(targetUser.Id)) {
      var patchErr = new ResponseDto<UserDto>([], "No se pudo eliminar el usuario.");
      return StatusCode(StatusCodes.Status409Conflict, patchErr);
    }

    // RES
    ////

    // dto
    var dto = new ResponseDto<UserDto>([], $"El usuario '{targetUser.Name}' fue eliminado con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }
}

// TODO: Create entity AGENDA (many Agendas to 1 User) + migrate DB + return a DtoUserWithAgenda
