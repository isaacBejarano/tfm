using System.ComponentModel.DataAnnotations;

namespace Api.Shared;

// Validating DTO super
public record DtoId(
  [Required(ErrorMessage = "Campo 'Id' obligatorio.")]
  Guid Id
);

// by now, only being use by smoke tests
