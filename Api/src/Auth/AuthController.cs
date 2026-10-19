using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace Api.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class AuthController(
  IUserRepositoryService _userRepoSrv // DI
  ) : ControllerBase {

  // POST "/auth"
  [HttpPost]
  public ActionResult<DtoResponse<object>> Login([FromBody] DtoUser payload) {
    // VALIDATION within 'DtoUser' //

    // FIXME: 1. Seed users, 1 admin X, 1 admin Tribunal, 1 superadmin me

    // TODO: 2. JWT auth + restrict unaouthorized routes


    // DB REPO //

    // payload dto -> model
    User? entity = _userRepoSrv.ReadByEmail(payload.Email);

    if (entity == null) {
      var dtoErr = new DtoResponse<object>([], "Credenciales incorrectas.");
      return StatusCode(StatusCodes.Status400BadRequest, dtoErr);
    }

    // HASHING -> verify password
    var entityHasher = new PasswordHasher<User>();
    var entityPasswordHashVerifiy = entityHasher.VerifyHashedPassword(entity, entity.Password, payload.Password);

    if (entityPasswordHashVerifiy != PasswordVerificationResult.Success) {
      var dtoErr = new DtoResponse<object>([], "Credenciales incorrectas.");
      return StatusCode(StatusCodes.Status400BadRequest, dtoErr);
    }

    // model -> res dto
    DtoId itemId = new(entity.Id);

    // TODO: return JWT in <headers> if authenticated user. No body

    // DTO -> only ID to go agenda by user ID
    var dto = new DtoResponse<object>([itemId], "Usuario autenticado.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }
}


