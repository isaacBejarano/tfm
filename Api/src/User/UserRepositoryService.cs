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
  public IEnumerable<User> ReadAll() {
    return [.. _ctx.Users]; // clone
  }

  // GET users/:id
  public User? ReadById(Guid id) {
    return _ctx.Users.FirstOrDefault(u => u.Id == id);
  }
}
