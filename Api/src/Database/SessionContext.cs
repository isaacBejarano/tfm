using Microsoft.EntityFrameworkCore;

namespace Api.Database;


public class SessionContext(IConfiguration config) : DbContext {
  // DB CONFIG (provider)
  protected override void OnConfiguring(DbContextOptionsBuilder ctxOpts)
      => ctxOpts.UseNpgsql(config.GetConnectionString("Postgres"));

  // DB SEEDING
  ////

  protected override void OnModelCreating(ModelBuilder builder) {
    base.OnModelCreating(builder); // for Identity if used in the future

    // SEEDING requires static values for dynamic types like 'Guid', 'DateTimeOffset', or the hassing of 'Password'
    // FIXME: SEEDING saves private data in Snapshots -> not secure even if using Linux env vars!
    User seedUser1 = new() {
      AgendaIds = [],
      Email = Environment.GetEnvironmentVariable("USER_1_EMAIL") ?? "none",
      Password = Environment.GetEnvironmentVariable("USER_1_PASS_HASH") ?? "none",
      Name = Environment.GetEnvironmentVariable("USER_1_NAME") ?? "none",
      Id = Guid.Parse(Environment.GetEnvironmentVariable("USER_1_ID") ?? "none"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:00.150Z"),
      Roles = [nameof(UserRole.User)]
    };
    User seedUser2 = new() {
      AgendaIds = [],
      Email = Environment.GetEnvironmentVariable("USER_2_EMAIL") ?? "none",
      Password = Environment.GetEnvironmentVariable("USER_2_PASS_HASH") ?? "none",
      Name = Environment.GetEnvironmentVariable("USER_2_NAME") ?? "none",
      Id = Guid.Parse(Environment.GetEnvironmentVariable("USER_2_ID") ?? "none"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:05.150Z"),
      Roles = [nameof(UserRole.User)]
    };
    User seedUser3 = new() {
      AgendaIds = [],
      Email = Environment.GetEnvironmentVariable("USER_3_EMAIL") ?? "none",
      Password = Environment.GetEnvironmentVariable("USER_3_PASS_HASH") ?? "none",
      Name = Environment.GetEnvironmentVariable("USER_3_NAME") ?? "none",
      Id = Guid.Parse(Environment.GetEnvironmentVariable("USER_3_ID") ?? "none"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:10.150Z"),
      Roles = [nameof(UserRole.User)]
    };
    User seedUser4 = new() {
      AgendaIds = [],
      Email = Environment.GetEnvironmentVariable("USER_4_EMAIL") ?? "none",
      Password = Environment.GetEnvironmentVariable("USER_4_PASS_HASH") ?? "none",
      Name = Environment.GetEnvironmentVariable("USER_4_NAME") ?? "none",
      Id = Guid.Parse(Environment.GetEnvironmentVariable("USER_4_ID") ?? "none"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:15.150Z"),
      Roles = [nameof(UserRole.User)]
    };
    User seedUser5 = new() {
      AgendaIds = [],
      Email = Environment.GetEnvironmentVariable("USER_5_EMAIL") ?? "none",
      Password = Environment.GetEnvironmentVariable("USER_5_PASS_HASH") ?? "none",
      Name = Environment.GetEnvironmentVariable("USER_5_NAME") ?? "none",
      Id = Guid.Parse(Environment.GetEnvironmentVariable("USER_5_ID") ?? "none"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:20.150Z"),
      Roles = [nameof(UserRole.User)]
    };
    User seedUser6 = new() {
      AgendaIds = [],
      Email = Environment.GetEnvironmentVariable("USER_6_EMAIL") ?? "none",
      Password = Environment.GetEnvironmentVariable("USER_6_PASS_HASH") ?? "none",
      Name = Environment.GetEnvironmentVariable("USER_6_NAME") ?? "none",
      Id = Guid.Parse(Environment.GetEnvironmentVariable("USER_6_ID") ?? "none"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:25.150Z"),
      Roles = [nameof(UserRole.User)]
    };
    User seedAdmin1 = new() {
      AgendaIds = [],
      Email = Environment.GetEnvironmentVariable("USER_7_EMAIL") ?? "none",
      Password = Environment.GetEnvironmentVariable("USER_7_PASS_HASH") ?? "none",
      Name = Environment.GetEnvironmentVariable("USER_7_NAME") ?? "none",
      Id = Guid.Parse(Environment.GetEnvironmentVariable("USER_7_ID") ?? "none"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:30.150Z"),
      Roles = [nameof(UserRole.Admin)]
    };
    User seedAdmin2 = new() {
      AgendaIds = [],
      Email = Environment.GetEnvironmentVariable("USER_8_EMAIL") ?? "none",
      Password = Environment.GetEnvironmentVariable("USER_8_PASS_HASH") ?? "none",
      Name = Environment.GetEnvironmentVariable("USER_8_NAME") ?? "none",
      Id = Guid.Parse(Environment.GetEnvironmentVariable("USER_8_ID") ?? "none"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:35.150Z"),
      Roles = [nameof(UserRole.Admin)]
    };
    User seedSuper = new() {
      AgendaIds = [],
      Email = Environment.GetEnvironmentVariable("USER_9_EMAIL") ?? "none",
      Password = Environment.GetEnvironmentVariable("USER_9_PASS_HASH") ?? "none",
      Name = Environment.GetEnvironmentVariable("USER_9_NAME") ?? "none",
      Id = Guid.Parse(Environment.GetEnvironmentVariable("USER_9_ID") ?? "none"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:40.150Z"),
      Roles = [nameof(UserRole.Super)]
    };

    builder.Entity<User>().HasData(
      seedUser1,
      seedUser2,
      seedUser3,
      seedUser4,
      seedUser5,
      seedUser6,
      seedAdmin1,
      seedAdmin2,
      seedSuper
    );
  }

  // DB ENTITIES
  public DbSet<User> Users { get; set; }
}

