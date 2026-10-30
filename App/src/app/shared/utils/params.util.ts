import { REGEX_GUID_V7 } from '@shared/constants/regex';

/** Check the passed in ID conforms to the UUID version 7 format */
const checkGuidv7 = (id: string): void | never => {
  if (!REGEX_GUID_V7.test(id)) throw Error('ERROR: Incorrect ID format'); // guid is 36
};

export { checkGuidv7 };
