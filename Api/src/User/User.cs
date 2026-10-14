
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api.Models;

[Table("tfm_users")]
[PrimaryKey(nameof(Id))]
[Index(nameof(Email), IsUnique = true)]
public class User : Audit {
  public Guid Id { get; init; } = Guid.CreateVersion7();
  public string? Email { get; set; }
  public string? Password { get; set; }
  public string? Name { get; set; } = "Anónimo";
}

// NOTE: "EF Core" uses class props syntax (no fields)
