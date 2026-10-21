using Microsoft.AspNetCore.Identity;
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

    // Seeding requires static values for dynamic types like 'Guid', 'DateTimeOffset', or the hassing of 'Password'
    User seedUser1 = new() {
      Email = "Kalush@yopmail.com",
      Password = "AQAAAAIAAYagAAAAEGwHgGIpRMXWQEvkORiPfV6rtNf3mgCqvdfJA115SNOSj+2r2qfzc+kjluWj3OytXw==", // Aa@12345
      Name = "Kalush",
      Id = Guid.Parse("0195e280-1000-7100-8000-000000000001"),
      Created = DateTimeOffset.Parse("2026-06-06T18:06:36.150Z")
    };
    User seedUser2 = new() {
      Email = "Dorofeeva@yopmail.com",
      Password = "AQAAAAIAAYagAAAAEHCYfGDeayZq/9Gi0gjYFQwNpMYM6+UJJw43Z6FwrBwJTnpcYcGS4q0hD0wNc4g9uA==", // Bb@12345
      Name = "Dorofeeva",
      Id = Guid.Parse("0195e280-1001-7100-8000-000000000002"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:05.150Z")
    };
    User seedUser3 = new() {
      Email = "Kola@yopmail.com",
      Password = "AQAAAAIAAYagAAAAELtGwVxD76L9NvJBwWoBaHJ+6jPxX58iSqC0Yb1bJj7Kb7GiBgUz/EIaY/MtwNSN1Q==", // Cc@12345
      Name = "Kola",
      Id = Guid.Parse("0195e280-1002-7100-8000-000000000003"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:11.320Z")
    };
    User seedUser4 = new() {
      Email = "Onuka@yopmail.com",
      Password = "AQAAAAIAAYagAAAAEJ+PnhCcxUVxFzAy8scD19KDucHiGgpHf2uSK1rw/SfXYPefcJO0yH39hhRWVDiNKw==", // Dd@12345
      Name = "Onuka",
      Id = Guid.Parse("0195e280-1003-7100-8000-000000000004"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:18.490Z")
    };
    User seedUser5 = new() {
      Email = "Parfeniuk@yopmail.com",
      Password = "AQAAAAIAAYagAAAAEB5nPeoMDxsQpa2lLQn/61jmKZe4XbsI9W01NeoCRHx69UERvu/Dc5B7fVDxXUqn8w==", // Ee@12345
      Name = "Parfeniuk",
      Id = Guid.Parse("0195e280-1004-7100-8000-000000000005"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:25.710Z")
    };
    User seedUser6 = new() {
      Email = "Tribunal@yopmail.com",
      Password = "AQAAAAIAAYagAAAAEHsuE/FMumGyWhg0+txuAkz6gTXKnbgkSOmuCc+rnr3VTdjastEqgvs1Srr+8I3Jiw==", // Tribunal@uoc2026
      Name = "Tribunal",
      Id = Guid.Parse("0195e280-1005-7100-8000-000000000006"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:33.880Z")
    };
    User seedUser7 = new() {
      Email = "Anonymous@yopmail.com",
      Password = "AQAAAAIAAYagAAAAEPvNNRBeFpA9snhyBGCdYEZ3/EqHvrCUMawAIzfHxoDMDl5HA7TC+JL8wyTIxFMSEA==", // Xx@12345
      Name = null,
      Id = Guid.Parse("0195e280-1006-7100-8000-000000000007"),
      Created = DateTimeOffset.Parse("2026-06-06T12:00:42.050Z")
    };

    builder.Entity<User>().HasData(
      seedUser1,
      seedUser2,
      seedUser3,
      seedUser4,
      seedUser5,
      seedUser6,
      seedUser7
    );
  }

  // DB ENTITIES
  public DbSet<User> Users { get; set; }
}

