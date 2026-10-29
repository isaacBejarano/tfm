// TODO: Create a Model and Migration + make class inherit from 'Audit'
public record DtoAgenda(
  Guid Id,
  string Title,
  string Subtitle,
  string Author,
  Season StartSeason,
  Week[] Weeks
);

// TODO: Create a Model and Migration (must include Veegies per week)
public record Week(
  Veggie[] Monday,
  Veggie[] Tuesday,
  Veggie[] Wednesday,
  Veggie[] Thursday,
  Veggie[] Friday,
  Veggie[] Saturday,
  Veggie[] Sunday
);
