using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SmokeController : ControllerBase {
  [HttpGet("/smoke/almost")]
  public ActionResult<DtoResponse<DtoId>> GetSmokeAlmost() {
    var dto = new DtoResponse<DtoId>([], "");
    return StatusCode(StatusCodes.Status200OK, dto);
  }

  [HttpGet("/smoke/full")]
  public ActionResult<DtoResponse<DtoId>> GetSmokeFull() {
    var itemEmpty = new DtoId(Guid.Empty);
    var itemFull = new DtoId(Guid.NewGuid());
    var dto = new DtoResponse<DtoId>([itemEmpty, itemFull], "You got smoked!");
    return StatusCode(StatusCodes.Status200OK, dto);
  }
}
