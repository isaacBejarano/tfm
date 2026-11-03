using Microsoft.EntityFrameworkCore;

namespace Api.Database;


public class SessionContext(IConfiguration config) : DbContext {
  // DB CONFIG (provider)
  protected override void OnConfiguring(DbContextOptionsBuilder ctxOpts)
      => ctxOpts.UseNpgsql(config.GetConnectionString("Postgres"));

  // DB ENTITIES
  public DbSet<User> Users { get; set; }
}
