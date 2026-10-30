/** UUID version 7
 * - String of 32 hexadecimal digits in lowercase with four hyphens (8-4-4-4-12 format)
 */
const checkGuidv7 = (id: string): void | never => {
  const regexGuidV7 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (!regexGuidV7.test(id)) throw Error('ERROR: Incorrect ID format'); // guid is 36
};

export { checkGuidv7 };
