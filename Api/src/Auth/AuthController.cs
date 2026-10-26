using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;


namespace Api.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class AuthController(
  // DI
  IConfiguration _config,
  IUserRepositoryService _userRepoSrv
  ) : ControllerBase {

  // POST "/auth"
  [HttpPost]
  public ActionResult<DtoResponse<object>> Login([FromBody] DtoUser payload) {
    // VALIDATION within 'DtoUser' //

    // FIXME: 1. Mod Seed with roles "user", "admin" and "super"

    // TODO: 2. JWT auth + restrict unaouthorized routes

    // DB REPO //

    // payload dto -> model
    User? entity = _userRepoSrv.ReadByEmail(payload.Email);

    if (entity == null) {
      var dtoErr = new DtoResponse<object>([], "Credenciales incorrectas.");
      return StatusCode(StatusCodes.Status400BadRequest, dtoErr);
    }

    // TODO: exncapsulate hsasing fx into SRV

    // HASHING -> verify password
    var entityHasher = new PasswordHasher<User>();
    var entityPasswordHashVerifiy = entityHasher.VerifyHashedPassword(entity, entity.Password, payload.Password);

    if (entityPasswordHashVerifiy != PasswordVerificationResult.Success) {
      var dtoErr = new DtoResponse<object>([], "Credenciales incorrectas.");
      return StatusCode(StatusCodes.Status400BadRequest, dtoErr);
    }

    // model -> res dto
    DtoId itemId = new(entity.Id);

    // TODO: CLAIMS / ROLES
    Claim[] claimsSuper =
    [
      new Claim("Id", itemId.Id.ToString()),
      new Claim("Roles", "super")
    ];

    // common tokens props
    var _expires = uint.Parse(_config["AccessToken:Expires"]!);
    var _secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AccessToken:SecretKey"]!));

    var tokenAccess = new JwtSecurityToken(
        issuer: _config["AccessToken:Issuer"]!,
        audience: _config["AccessToken:Audience"]!,
        claims: claimsSuper,
        notBefore: DateTimeOffset.UtcNow.UtcDateTime,
        expires: DateTimeOffset.UtcNow.AddMinutes(_expires).UtcDateTime, // TODO: 1 week
        signingCredentials: new SigningCredentials(_secretKey, SecurityAlgorithms.HmacSha256)
    );

    // TODO: validate JWT?
    var jwt = new JwtSecurityTokenHandler().WriteToken(tokenAccess);


    // headers -> JWT in <headers> (not in the body)
    Response.Headers.Append("Authorization", $"Bearer {jwt}");


    // DTO -> only ID to go agenda by user ID
    var dto = new DtoResponse<object>([itemId], "Usuario autenticado.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }
}


