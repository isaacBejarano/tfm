using Api.Shared;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SmokeController : ControllerBase {
  [HttpGet]
  public DtoId GetSmoke() {
    return new DtoId(Guid.Empty);
  }
}
