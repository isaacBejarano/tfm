namespace Api.Repositories;


public class UserRepositoryService(
  SessionContext _ctx // DI
) : IUserRepositoryService {

  // POST user/
  public User? Create(User user) {
    ArgumentNullException.ThrowIfNull(user);

    // prevent duplicate unique field "Email" collision
    bool alreadyCreated = _ctx.Users.Any(u => u.Email == user.Email);
    if (alreadyCreated) return null;

    var tracked = _ctx.Users.Add(user);
    _ctx.SaveChanges();
    return tracked.Entity;
  }

  // GET "user/"
  public IEnumerable<User> ReadAll() {
    return [.. _ctx.Users]; // clone
  }

  // GET user/:id
  public User? ReadById(Guid id) {
    return _ctx.Users.FirstOrDefault(u => u.Id == id);
  }
}
