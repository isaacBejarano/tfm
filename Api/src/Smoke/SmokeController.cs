using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class SmokeController() : ControllerBase {
  [HttpGet]
  public ActionResult<DtoResponse<object>> GetSmoke() {
    var dto = new DtoResponse<object>([], "");
    return StatusCode(StatusCodes.Status200OK, dto);
  }
}
