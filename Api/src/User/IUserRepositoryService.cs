namespace Api.Interfaces;

// Destructive C*UD ops require validated 'payload' DTO!

public interface IUserRepositoryService {

  // POST user/
  public User? Create(User user);

  // // GET user/
  // public IEnumerable<User> ReadAll();


  // // POST auth/
  // public User? ReadByCreds(DtoUserCreds payload);

  // // GET user/:id
  // public User? ReadById(Guid id);

  // // PATCH user/:id
  // public User? Update(DtoUserCreds creds, DtoUserCreds edit);

  // // DELETE user/:id
  // public bool Delete(DtoId payload);

  // // POST user/:id/archive
  // public User? Archive(DtoId payload);

  // // POST user/:id/restore
  // public User? Restore(DtoId payload);
}


// REST


// Create a new product POST  /api/products

// Read a list of all products GET /api/products
// Read a product by ID GET / api / products / id
// Read a product by category GET /api/products? category = category

// Update a product  PUT / api / products / id

// Delete a product DELETE  /api/products/id
