using Api.Database;
using Api.Dtos;
using Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class SmokeController(IConfiguration config) : ControllerBase {
  [HttpGet("almost")]
  public ActionResult<DtoResponse<DtoId>> GetSmokeAlmost() {
    var dto = new DtoResponse<DtoId>([], "");
    return StatusCode(StatusCodes.Status200OK, dto);
  }

  [HttpGet("full")]
  public ActionResult<DtoResponse<DtoId>> GetSmokeFull() {
    var itemEmpty = new DtoId(Guid.Empty);
    var itemFull = new DtoId(Guid.CreateVersion7());
    var dto = new DtoResponse<DtoId>([itemEmpty, itemFull], "¡Toma humo!");
    return StatusCode(StatusCodes.Status200OK, dto);
  }

  [HttpGet("postgress")]
  public ActionResult<DtoResponse<DtoId>> GetPostgresUser() {
    // db ctx
    using var sessionCtx = new SessionContext(config); // db ctx 'using' --> close connection after usage

    // FIXME: Repository Pattern CRUD methods
    // https://learn.microsoft.com/es-es/ef/core/get-started/overview/first-app?tabs=netcore-cli#create-read-update--delete

    // CRUD --> create
    sessionCtx.Users.Add(new User());
    sessionCtx.SaveChanges();

    // CRUD --> read all
    var users = sessionCtx.Users.ToList();
    if (users == null) {
      var dtoErr = new DtoResponse<DtoUser>([], "No se pudo acceder a los usuarios.");
      return StatusCode(StatusCodes.Status409Conflict, dtoErr);
    }

    var items = users.Select(record => new DtoUser(
      Id: record.Id,
      Email: record.Email,
      Name: record.Name,
      Password: record.Password
    )).ToArray();

    // DTO
    var dto = new DtoResponse<DtoUser>(items, "Lista de usuarios obtenida con éxito.");
    return StatusCode(StatusCodes.Status200OK, dto);
  }
}
