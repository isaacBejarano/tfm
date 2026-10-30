import { FieldTree } from '@angular/forms/signals';
import { Btn } from '../components/btn/btn';

/** Return Tailwind border color classes to style validation on form fields */
const validationBorder = (field: FieldTree<string | number, string>): string => {
  if (field().dirty() && field().errors().length > 0) return `border ${Btn.borderColors['red']}`;
  else if (field().dirty() && field().errors().length === 0)
    return `border ${Btn.borderColors['green']}`;
  else return `border ${Btn.borderColors['gray']}`;
};

export { validationBorder };
