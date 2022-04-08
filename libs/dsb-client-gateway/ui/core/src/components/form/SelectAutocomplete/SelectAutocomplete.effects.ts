import { SyntheticEvent, useState } from 'react';
import { GenericFormField } from '../../../containers';
import { FormSelectOption } from '../FormSelect';

export const useSelectAutocompleteEffects = <FormValuesType>(
  onChange: (newValue: FormSelectOption[]) => void,
  field: GenericFormField<FormValuesType>
) => {
  const [textValue, setTextValue] = useState<string>('');

  const changeHandler = (
    event: SyntheticEvent,
    value: (string | FormSelectOption)[]
  ) => {
    const maxValues = field.multiple ? field.maxValues : 1;
    const slicedValues = value
      ? (value as FormSelectOption[]).slice(0, maxValues ?? value.length)
      : (value as FormSelectOption[]);

    onChange(slicedValues);

    setTextValue('');
  };

  return {
    options: field.options,
    textValue,
    setTextValue,
    changeHandler,
  };
};
