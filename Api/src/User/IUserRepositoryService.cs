namespace Api.Interfaces;

// Destructive C*UD ops require validated 'payload' DTO!

public interface IUserRepositoryService {
  // POST "users/" <- Signup
  public User? Create(User user);


  // POST "auth/" <- Login
  public User? ReadByEmail(string email);

  // GET "users/" <- User List (filter by Token roles)
  public IEnumerable<User> ReadAllByRoles(UserRole[] targetRoles);

  // GET "users/:id" <- User Profile Read (filter by Token roles)
  public User? ReadById(Guid id);


  // PATCH users/:id <- User Profile Edit (filter by Token roles)
  public User? Patch(Guid id, UserPatch patch);


  // DELETE users/:id <- User Profile Delete (filter by Token roles)
  public bool DeleteHard(Guid id);
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
