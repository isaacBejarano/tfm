
// TODO: Create a Model and Migration
public record Veggie {
  // taxonomy
  public string Vernacular { get; init; } = "";
  public string[] TaxonList { get; init; } = [];
  public string Species { get; init; } = "";
  // health
  public string HealthBenefit { get; init; } = "";
  public string[] FitoElements { get; init; } = [nameof(FitoElement.Empty)];
  // desc
  public string Habitat { get; init; } = "";
  public string SoilType { get; init; } = "";
  public string SoilComposition { get; init; } = "";
  public string Stem { get; init; } = "";
  public string Leaves { get; init; } = "";
  public string Roots { get; init; } = "";
  public string Buds { get; init; } = "";
  public string Flowers { get; init; } = "";
  public string Fruits { get; init; } = "";
  // care
  public string ExposureSun { get; init; } = "";
  public string ExposureHeat { get; init; } = "";
  public string ExposureCold { get; init; } = "";
  public string ExposureMoist { get; init; } = "";
  public string ExposureWind { get; init; } = "";
  public string ExposureRain { get; init; } = "";
  public string Watering { get; init; } = "";
  public string Pollination { get; init; } = "";
  public string Fertilization { get; init; } = "";
  public string FruitCare { get; init; } = "";
  public string EvapoCoeficient { get; init; } = "";
  // enemies
  public string[] PlagueVertebrates { get; init; } = [];
  public string[] PlagueBugs { get; init; } = [];
  public string[] PlagueFungae { get; init; } = [];
  public string[] PlagueUnicellular { get; init; } = [];
}


// TODO: Create a Model and Migration (all vbeggies in the sys to consult)
// this can be a public endpoint? or private with no role-based AuthZ
public record Catalogue(
  Veggie[] Veggies
);
