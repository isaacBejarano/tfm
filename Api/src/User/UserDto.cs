namespace Api.Shared;

public record UserDto(
  Guid Id,
  Guid[] AgendaIds, // FK one-to-many; 1 user may have multiple agendas (e.g. 4 seasons)
  string Email,
  string[] Roles,
  string? Name = null
);








