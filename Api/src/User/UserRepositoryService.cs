namespace Api.Repositories;


public class UserRepositoryService(
  SessionContext _ctx // DI
) : IUserRepositoryService {

  // POST users/
  public User? Create(User user) {
    ArgumentNullException.ThrowIfNull(user);
    // prevent duplicates by unique field "Email" collision
    if (_ctx.Users.Any(u => u.Email == user.Email)) return null;

    var tracked = _ctx.Users.Add(user);
    return _ctx.SaveChanges() > 0 ? tracked.Entity : null; // affectedRows ~1
  }


  // POST "auth/" <- login
  public User? ReadByEmail(string email) {
    ArgumentException.ThrowIfNullOrWhiteSpace(email);
    return _ctx.Users.FirstOrDefault(u => u.Email == email);
  }

  // GET "users/"
  public IEnumerable<User> ReadAllByRoles(UserRole[] targetRoles) {
    string[] roles = [.. targetRoles.Select(r => r.ToString())];
    return _ctx.Users.Where(u => u.Roles.Any(r => roles.Contains(r))).OrderBy(u => u.Id);
  }

  // GET users/:id
  public User? ReadById(Guid id) {
    return _ctx.Users.Find(id);
  }


  // PATCH "/users/:id"
  public User? Patch(Guid id, UserPatch patch) {
    ArgumentNullException.ThrowIfNull(patch);
    User? user = ReadById(id);
    if (!string.IsNullOrEmpty(patch.Password)) user?.Password = patch.Password;
    if (!string.IsNullOrEmpty(patch.Name)) user?.Name = patch.Name;
    return _ctx.SaveChanges() > 0 ? user : null; // affectedRows ~1
  }

  // DELETE users/:id
  public bool DeleteHard(Guid id) {
    User? user = ReadById(id);
    if (user == null) return false;

    _ctx.Users.Remove(user);
    return _ctx.SaveChanges() > 0; // affectedRows ~1
  }
}

// NOTE: 'Find(id)' searches PK in cached ctx. If not found, then retrieves from DB
