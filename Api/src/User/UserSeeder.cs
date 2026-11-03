namespace Api.Database;

public static class ApiSeeder {

  public static WebApplication UserSeed(this WebApplication api) {
    using (var scope = api.Services.CreateScope()) {

      using var ctx = scope.ServiceProvider.GetRequiredService<SessionContext>();

      try {
        ctx.Database.EnsureCreated();
        User? anyUser = ctx.Users.FirstOrDefault();

        if (anyUser == null) {
          User seedUser1 = new() {
            Email = Environment.GetEnvironmentVariable("USER_1_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_1_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_1_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser2 = new() {
            Email = Environment.GetEnvironmentVariable("USER_2_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_2_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_2_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser3 = new() {
            Email = Environment.GetEnvironmentVariable("USER_3_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_3_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_3_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser4 = new() {
            Email = Environment.GetEnvironmentVariable("USER_4_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_4_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_4_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser5 = new() {
            Email = Environment.GetEnvironmentVariable("USER_5_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_5_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_5_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser6 = new() {
            Email = Environment.GetEnvironmentVariable("USER_6_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_6_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_6_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser7 = new() {
            Email = Environment.GetEnvironmentVariable("USER_7_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_7_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_7_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser8 = new() {
            Email = Environment.GetEnvironmentVariable("USER_8_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_8_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_8_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser9 = new() {
            Email = Environment.GetEnvironmentVariable("USER_9_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_9_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_9_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser10 = new() {
            Email = Environment.GetEnvironmentVariable("USER_10_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_10_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_10_NAME")!,
            Roles = [nameof(UserRole.User)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser11 = new() {
            Email = Environment.GetEnvironmentVariable("USER_11_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_11_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_11_NAME")!,
            Roles = [nameof(UserRole.Admin)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser12 = new() {
            Email = Environment.GetEnvironmentVariable("USER_12_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_12_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_12_NAME")!,
            Roles = [nameof(UserRole.Admin)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };
          User seedUser13 = new() {
            Email = Environment.GetEnvironmentVariable("USER_13_EMAIL")!,
            Password = Environment.GetEnvironmentVariable("USER_13_PASS_HASH")!,
            Name = Environment.GetEnvironmentVariable("USER_13_NAME")!,
            Roles = [nameof(UserRole.Super)],
            Id = Guid.CreateVersion7(),
            Created = DateTimeOffset.UtcNow
          };

          ctx.Users.AddRange(
            seedUser1,
            seedUser2,
            seedUser3,
            seedUser4,
            seedUser5,
            seedUser6,
            seedUser7,
            seedUser8,
            seedUser9,
            seedUser10,
            seedUser11,
            seedUser12,
            seedUser13
          );

          ctx.SaveChanges();
        }
      }
      catch (Exception) {
        throw;
      }

      return api;
    }

  }
}
