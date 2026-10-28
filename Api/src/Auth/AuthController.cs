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
  public ActionResult<DtoResponse<DtoUser>> Login([FromBody] UserPayloadLogin payload) {
    // VALIDATION within 'UserPayloadLogin' //

    // DB REPO //

    // payload dto -> model
    User? entity = _userRepoSrv.ReadByEmail(payload.Email);

    if (entity == null) {
      var dtoErr = new DtoResponse<object>([], "Credenciales incorrectas.");
      return StatusCode(StatusCodes.Status400BadRequest, dtoErr);
    }

    // TODO: exncapsulate hsasing fx into SRV?

    // HASHING -> verify password
    var entityHasher = new PasswordHasher<User>();
    var entityPasswordHashVerifiy = entityHasher.VerifyHashedPassword(entity, entity.Password, payload.Password);

    if (entityPasswordHashVerifiy != PasswordVerificationResult.Success) {
      var dtoErr = new DtoResponse<object>([], "Credenciales incorrectas.");
      return StatusCode(StatusCodes.Status400BadRequest, dtoErr);
    }

    // TODO: encapsulate this logic into a TokenService?

    // CLAIMS (entries with built-in 'ClaimTypes' as keys)
    List<Claim> claims = [
      new Claim(ClaimTypes.NameIdentifier, entity.Id.ToString()), // entity unique PK
      new Claim(ClaimTypes.Email, entity.Email), // entity unique prop
      new Claim(JwtRegisteredClaimNames.Jti, Guid.CreateVersion7().ToString()) // JWT own id
    ];

    // entity roles
    foreach (var role in entity.Roles) {
      var claim = new Claim(ClaimTypes.Role, role);
      if (claim == null) continue;
      claims.Add(claim);
    }

    // common tokens props
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

    var jwt = new JwtSecurityTokenHandler().WriteToken(tokenAccess);

    // headers -> JWT in <headers> (not in the body)
    Response.Headers.Append("Authorization", $"Bearer {jwt}");

    // DTO
    DtoUser item = new(
      Id: entity.Id,
      Email: entity.Email,
      Name: entity.Name,
      Roles: entity.Roles
    );
    var dto = new DtoResponse<DtoUser>([item], "Usuario autenticado.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }
}
