namespace Api.Repositories;


public class UserRepositoryService(SessionContext context) : IUserRepositoryService {
  // DI
  private readonly SessionContext _ctx = context;


  // POST user/
  public User? Create(User user) {
    ArgumentNullException.ThrowIfNull(user);

    // don't attrempt duplication
    bool alreadyCreated = _ctx.Users.Any(u => u.Email == user.Email);

    if (alreadyCreated) return null;


    var tracked = _ctx.Users.Add(user);
    _ctx.SaveChanges();
    return tracked.Entity;
  }
}
