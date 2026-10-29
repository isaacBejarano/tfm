using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;


namespace Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController(
  // DI
  IConfiguration _config,
  IUserRepositoryService _userRepoSrv
  ) : ControllerBase {

  // POST "/auth"
  [HttpPost]
  public ActionResult<ResponseDto<UserDto>> Login([FromBody] UserPayloadLogin payload) {
    // VALIDATION within 'UserPayloadLogin'
    ////

    // DB Repo
    ////

    // payload -> model
    User? entity = _userRepoSrv.ReadByEmail(payload.Email);
    if (entity == null) {
      var modelErr = new ResponseDto<object>([], "Credenciales incorrectas.");
      return StatusCode(StatusCodes.Status400BadRequest, modelErr);
    }

    // VALIDATE Password Hash
    ////

    var entityHasher = new PasswordHasher<User>();
    var entityPasswordHashVerifiy = entityHasher.VerifyHashedPassword(entity, entity.Password, payload.Password);
    if (entityPasswordHashVerifiy != PasswordVerificationResult.Success) {
      var securityErr = new ResponseDto<object>([], "Credenciales incorrectas.");
      return StatusCode(StatusCodes.Status400BadRequest, securityErr);
    }

    // JWT ACCES TOKEN
    ////

    // jwt claims

    List<Claim> claims = [
      new Claim(ClaimTypes.NameIdentifier, entity.Id.ToString()), // entity unique PK
      new Claim(ClaimTypes.Email, entity.Email), // entity unique prop
      new Claim(JwtRegisteredClaimNames.Jti, Guid.CreateVersion7().ToString()) // JWT own id
    ];

    foreach (var role in entity.Roles) {
      var claim = new Claim(ClaimTypes.Role, role);
      if (claim == null) continue;
      claims.Add(claim); // entity roles
    }

    // jwt config

    var _expires = uint.Parse(_config["AccessToken:Expires"]!); // FIXME: set to 6 hours if no Refresh Token available
    var _secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AccessToken:SecretKey"]!));
    var tokenAccess = new JwtSecurityToken(
        issuer: _config["AccessToken:Issuer"]!,
        audience: _config["AccessToken:Audience"]!,
        claims,
        notBefore: DateTimeOffset.UtcNow.UtcDateTime,
        expires: DateTimeOffset.UtcNow.AddMinutes(_expires).UtcDateTime, // TODO: FASE 2: set to 1 week
        signingCredentials: new SigningCredentials(_secretKey, SecurityAlgorithms.HmacSha256)
    );

    // RES
    ////

    // entity -> dto
    UserDto item = new(
      Id: entity.Id,
      AgendaIds: [Guid.Empty],
      Email: entity.Email,
      Name: entity.Name,
      Roles: entity.Roles
    );

    // headers add jwt
    var jwt = new JwtSecurityTokenHandler().WriteToken(tokenAccess);
    Response.Headers.Append("Authorization", $"Bearer {jwt}");

    // dto
    var dto = new ResponseDto<UserDto>([item], "Usuario autenticado.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }
}
