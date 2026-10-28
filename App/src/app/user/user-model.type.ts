type User = {
  id: string;
  email: string;
  password: string; // nullable when sent as Edit paylaod
  name: string; // nullable when sent as Signup or Edit paylaod
  roles: UserRole[];
};

type UserPayloadSignup = Pick<User, 'email' | 'password'> & { name: string | null };
type UserPayloadLogin = Pick<User, 'email' | 'password'>;
type UserPayloadEdit = { password: string | null; name: string | null };
type UserRole = 'User' | 'Admin' | 'Super';

export type { User, UserPayloadEdit, UserPayloadLogin, UserPayloadSignup, UserRole };

/*
 * VALIDATIONS [id]
 - Required
    -> "El campo 'Id' es obligatorio."

 * VALIDATIONS [email]
 - Required
    -> "El campo 'Correo electrónico' es obligatorio."
 - MinLength:6
    -> "El campo 'Correo electrónico' debe tener al menos 6 carácteres."
 - MaxLength:150
    -> "El campo 'Correo electrónico' debe tener máximo 150 carácteres."
 - EmailAddress + RegularExpression: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    -> "El campo 'Correo electrónico' debe tener un patrón válido."

 * VALIDATIONS [password]
 - Required
    -> "El campo 'Contraseña' es obligatorio."
 - MinLength:8
    -> "El campo 'Contraseña' debe tener al menos 8 carácteres."
 - MaxLength:16
    -> "El campo 'Contraseña' debe tener máximo 16 carácteres."
 - RegularExpression: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$/
    -> "El campo 'Contraseña' debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial."

 * VALIDATIONS [name]
 - MinLength:1
    -> "El campo 'Nombre' debe tener al menos 1 carácter."
 - MaxLength:25
    -> "El campo 'Nombre' debe tener máximo 25 carácteres."


  * REGEXP PASS -> ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$
  * REGEXP EMAIL -> ^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 */
