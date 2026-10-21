namespace Api.Models;

// super class
public class Audit {
  public required DateTimeOffset Created { get; set; } // DateTimeOffset.UtcNow;
  public DateTimeOffset? Updated { get; set; }
  public DateTimeOffset? Archived { get; set; }
}
