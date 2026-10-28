using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Api.Payloads;

// PAYLOAD & VALIDATION
////

public record UserPayloadLogin(
  [Required(ErrorMessage = "El campo 'Correo electrónico' es obligatorio.")]
  [MinLength(6, ErrorMessage = "El campo 'Correo electrónico' debe tener al menos 6 carácteres.")]
  [MaxLength(150, ErrorMessage = "El campo 'Correo electrónico' debe tener máximo 150 carácteres.")]
  [EmailAddress(ErrorMessage = "El campo 'Correo electrónico' debe tener un patrón válido.")] // pattern
  [RegularExpression(
    @"^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$",
    ErrorMessage = "El campo 'Correo electrónico' debe tener un patrón válido FIXME:."
  )] // pattern tighten
  [DataType(DataType.EmailAddress)] // UI like Swagger renders it as [type='email']
  string Email,

  [Required(ErrorMessage = "El campo 'Contraseña' es obligatorio.")]
  [MinLength(8, ErrorMessage = "El campo 'Contraseña' debe tener al menos 8 carácteres.")]
  [MaxLength(16, ErrorMessage = "El campo 'Contraseña' debe tener máximo 16 carácteres.")]
  [RegularExpression(
    @"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$",
    ErrorMessage = "El campo 'Contraseña' debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial."
  )] // pattern
  [PasswordPropertyText] // UI like Swagger renders it as obscured
  [DataType(DataType.Password)] // UI like Swagger renders it as [type='password']
  string Password
);


// REGEXP EMAIL -> ^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
// REGEXP PASS -> ^(?=.*[0 - 9])(?=.*[a - z])(?=.*[A - Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$

/* NOTE
 * Expand email pattern with a Regular Expression, for the following cases where .NET data anotation [EmailAdress] is not enough:
 * - `mysite@.yopmail.my` [ tld (Top Level domain) can not start with dot "." ]
 * - `mysite@.yopmail.org` [ tld can not start with dot "." ]
 * - `mysite()*@yopmail.com` [ here the regular expression only allows character, digit, underscore, and dash ]
 * - `.mysite@yopmail.org` [ an email should not be start with "." ]
 * - `mysite..1234@yopmail.com` [double dots are not allowed]
*/
