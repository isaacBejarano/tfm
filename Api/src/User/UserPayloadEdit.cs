using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Api.Payloads;

// PAYLOAD & VALIDATION
////

public record UserPayloadEdit(
  [Required(ErrorMessage = "El campo 'Contraseña' es obligatorio.")]
  [MinLength(8, ErrorMessage = "El campo 'Contraseña' debe tener al menos 8 carácteres.")]
  [MaxLength(16, ErrorMessage = "El campo 'Contraseña' debe tener máximo 16 carácteres.")]
  [RegularExpression(
    @"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$",
    ErrorMessage = "El campo 'Contraseña' debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial."
  )] // pattern
  [PasswordPropertyText] // UI like Swagger renders it as obscured
  [DataType(DataType.Password)] // UI like Swagger renders it as [type='password']
  string? Password = null,

  [MinLength(1, ErrorMessage = "El campo 'Nombre' debe tener al menos 1 carácter.")]
  [MaxLength(25, ErrorMessage = "El campo 'Nombre' debe tener máximo 25 carácteres.")]
  string? Name = null
);

// REGEXP PASS -> ^(?=.*[0 - 9])(?=.*[a - z])(?=.*[A - Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$
