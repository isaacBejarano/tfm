
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api.Models;

[Table("tfm_users")]
[PrimaryKey(nameof(Id))]
[Index(nameof(Email), IsUnique = true)]
public class User : Audit {
  public required Guid Id { get; set; } // Guid.CreateVersion7();
  public required string Email { get; set; } // Dto must map!
  public required string Password { get; set; } // Dto must map!
  public string? Name { get; set; } = "Anónimo";
}

// NOTE: "EF Core" uses class props syntax (no fields)
