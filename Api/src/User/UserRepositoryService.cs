namespace Api.Repositories;


public class UserRepositoryService(
  SessionContext _ctx // DI
) : IUserRepositoryService {

  // POST users/
  public User? Create(User user) {
    ArgumentNullException.ThrowIfNull(user);

    // prevent duplicate unique field "Email" collision
    bool alreadyCreated = _ctx.Users.Any(u => u.Email == user.Email);
    if (alreadyCreated) return null;

    var tracked = _ctx.Users.Add(user);
    _ctx.SaveChanges();
    return tracked.Entity;
  }


  // POST "auth/" <- login
  public User? ReadByEmail(string email) {
    return _ctx.Users.FirstOrDefault(u => u.Email == email);
  }

  // GET "users/"
  public IEnumerable<User> ReadAllByRoles(string[] rolesManaged) {
    return (rolesManaged.Length > 1)
      ? [.. _ctx.Users.Where(u => u.Roles.Any(r => rolesManaged.Contains(r)))] // clone
      : (rolesManaged.Length == 1)
      ? [.. _ctx.Users.Where(u => u.Roles.Contains(rolesManaged[0]))] // clone
      : [];
  }

  // GET users/:id
  public User? ReadById(Guid id) {
    return _ctx.Users.FirstOrDefault(u => u.Id == id);
  }
}
