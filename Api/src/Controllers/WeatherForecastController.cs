using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase {
  private static readonly string[] Summaries = [
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
  ];

  [HttpGet(Name = "GetWeatherForecast")]
  public IEnumerable<WeatherForecast> Get() {
    var _min = -20;
    int _max = 55;

    return Enumerable.Range(1, 5).Select(index => new WeatherForecast {
      Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
      TemperatureC = Random.Shared.Next(_min, _max),
      Summary = Summaries[Random.Shared.Next(Summaries.Length)]
    }).ToArray();
  }
}
