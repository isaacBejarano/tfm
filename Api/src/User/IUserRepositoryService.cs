namespace Api.Interfaces;

// Destructive C*UD ops require validated 'payload' DTO!

public interface IUserRepositoryService {

  // POST "user/" <- signup
  public User? Create(User user);



  // POST "auth/" <- login
  public User? ReadByEmail(string email);

  // GET "user/" <- admin list users TODO: AUTH + API filters DTO by Token claim "role" (no payload, no query param)
  public IEnumerable<User> ReadAll();

  // GET "user/:id" <- TODO: AUTH + API filters DTO by Token claim "role" (no payload, no query param)
  public User? ReadById(Guid id);




  // // PATCH user/:id
  // public User? Update(DtoUserCreds creds, DtoUserCreds edit);


  // // DELETE user/:id
  // public bool DeleteHard(DtoId payload);
}


// REST


// Create a new user -> POST /api/user

// Read a list of all users -> GET /api/user
// Read a user by ID -> GET /api/user/:id

// Update a user -> PUT /api/user/:id

// Delete (Hard) a user -> DELETE /api/user/:id
