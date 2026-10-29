using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class SmokeController() : ControllerBase {
  [HttpGet]
  public ActionResult<ResponseDto<object>> GetSmoke() {
    var dto = new ResponseDto<object>([], "");
    return StatusCode(StatusCodes.Status200OK, dto);
  }
}
