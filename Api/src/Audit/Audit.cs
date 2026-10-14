namespace Api.Models;

// super class
public class Audit {
  public DateTimeOffset Created { get; init; } = DateTimeOffset.UtcNow;
  public DateTimeOffset? Updated { get; set; }
  public DateTimeOffset? Archived { get; set; }
}
