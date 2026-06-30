import { GenericFormField } from '../../containers/GenericForm';
import { FormSelectOption } from './FormSelect';

export const getFormFieldPlaceholder = (
  field: GenericFormField,
  options: FormSelectOption[] = field.options ?? [],
): string => {
  if (options.length === 0) {
    return field.emptyPlaceholder ?? 'No options available';
  }

  return field.placeholder ?? field.inputProps?.placeholder ?? '';
};
