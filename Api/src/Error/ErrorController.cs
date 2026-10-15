using Microsoft.AspNetCore.Mvc;

namespace Api.Errors;

[ApiExplorerSettings(IgnoreApi = true)]
[ApiController]
public class ErrorController() : ControllerBase {
  // ERROR 404 - e.g. Endpoint not found
  [Route("error/404")]
  public IActionResult Handle404() {
    var dto = new DtoResponse<object>([], "API ERROR 404.");
    return StatusCode(StatusCodes.Status404NotFound, dto);
  }

  // ERROR 500 - Internal Server Error
  [Route("error/500")]
  public IActionResult Handle500() {
    var dto = new DtoResponse<object>([], "API ERROR 500.");
    return StatusCode(StatusCodes.Status500InternalServerError, dto);
  }

  // TODO: keep client-friendly other un handled errors thay may arrise
}
