using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SmokeController : ControllerBase {
  [HttpGet]
  public string GetSmoke() {
    return "smoke";
  }
}
