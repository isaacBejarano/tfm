using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Database;

public class SessionContext(IConfiguration config) : DbContext {
  // DB CONFIG
  protected override void OnConfiguring(DbContextOptionsBuilder opts)
      => opts.UseNpgsql(config.GetConnectionString("Postgres"));

  // DB ENTITIES
  public DbSet<User> Users { get; set; }
}

