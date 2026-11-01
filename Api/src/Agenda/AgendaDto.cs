namespace Api.Dto;

// TODO: Create a Model and Migration + make class inherit from 'Audit'
// FIXME: use FE type models
public record DtoAgenda(
  Guid Id,
  Guid UserId, // FK
  string Title,
  Season SeasonStart
// Week[] Weeks
);
// TODO: Agenda needs :Audit because Creation date is TODAY -> render Agenda View


// TODO: Create a Model and Migration (must include Veegies per week)
// public record Week(
//   Crop[] Monday,
//   Crop[] Tuesday,
//   Crop[] Wednesday,
//   Crop[] Thursday,
//   Crop[] Friday,
//   Crop[] Saturday,
//   Crop[] Sunday
// );
