/** Include at least one uppercase letter, one lowercase letter, one number, and one special character */
const REGEX_PASSWORD =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$/;

/** Expand email pattern with a Regular Expression, for the following cases where .NET data anotation [EmailAdress] is not enough:
 * - `mysite@.yopmail.my` [ tld (Top Level domain) can not start with dot "." ]
 * - `mysite@.yopmail.org` [ tld can not start with dot "." ]
 * - `mysite()*@yopmail.com` [ here the regular expression only allows character, digit, underscore, and dash ]
 * - `.mysite@yopmail.org` [ an email should not be start with "." ]
 * - `mysite..1234@yopmail.com` [double dots are not allowed]
 */
const REGEX_EMAIL = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/** UUID version 7 - String of 32 hexadecimal digits in lowercase with four hyphens (8-4-4-4-12 format) */
const REGEX_GUID_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export { REGEX_EMAIL, REGEX_GUID_V7, REGEX_PASSWORD };
