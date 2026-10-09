using System.ComponentModel.DataAnnotations;

namespace Api.Shared.Dtos;

// Validating DTO super
public record DtoId(
  [Required(ErrorMessage = "Campo 'Id' obligatorio.")]
  Guid Id
);
