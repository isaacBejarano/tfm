using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Api.Dtos;

// DTO & VALIDATION
////

public record DtoUser(
  [Required(ErrorMessage = "Campo 'Id' obligatorio.")]
  Guid Id,

  [Required(ErrorMessage = "Campo 'Correo electrónico' obligatorio.")]
  [MinLength(6, ErrorMessage = "Campo 'Correo electrónico' demasiado corto.")]
  [MaxLength(150, ErrorMessage = "Campo 'Correo electrónico' demasiado largo.")]
  [EmailAddress(ErrorMessage = "Campo 'Correo electrónico' sin patrón válido.")]
  [DataType(DataType.EmailAddress)] // UI like Swagger renders it as [type='email']
  string Email,

  [Required(ErrorMessage = "Campo 'Contraseña' obligatorio.")]
  [MinLength(8, ErrorMessage = "Campo 'Contraseña' demasiado corto.")]
  [MaxLength(16, ErrorMessage = "Campo 'Contraseña' demasiado largo.")]
  [PasswordPropertyText] // UI like Swagger renders it as obscured
  [DataType(DataType.Password)] // UI like Swagger renders it as [type='password']
  string Password,

  [MinLength(1, ErrorMessage = "Campo 'Nombre' demasiado corto.")]
  [MaxLength(25, ErrorMessage = "Campo 'Nombre' demasiado largo.")]
  string? Name = null
);
