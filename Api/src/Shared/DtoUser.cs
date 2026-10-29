namespace Api.Shared;

public record DtoUser(
  Guid Id,
  string Email,
  string[] Roles,
  string? Name = null
);
