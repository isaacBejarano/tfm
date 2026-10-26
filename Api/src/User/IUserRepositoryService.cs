namespace Api.Interfaces;

// Destructive C*UD ops require validated 'payload' DTO!

public interface IUserRepositoryService {
  // POST "users/" <- Signup
  public User? Create(User user);


  // POST "auth/" <- Login
  public User? ReadByEmail(string email);

  // GET "users/" <- User List (filter by Token roles)
  public IEnumerable<User> ReadAllByRoles(UserRole[] targetRoles);

  // GET "users/:id" <- TODO: AUTH + API filters DTO by Token claim "role" (no payload, no query param)
  public User? ReadById(Guid id);


  // // PATCH users/:id
  // public User? Update(DtoUserCreds creds, DtoUserCreds edit);


  // // DELETE users/:id
  // public bool DeleteHard(DtoId payload);
}


// REST resources
////

// Create a new user        -> POST   /api/users

// Read the list of users   -> GET    /api/users
// Read a user by ID        -> GET    /api/users/:id

// Update a user            -> PATCH  /api/users/:id
// Replace a user           -> PUT    /api/users/:id

// Delete (Hard) a user     -> DELETE /api/users/:id
// Delete (Soft) a user     -> PATCH  /api/users/:id
