import { SyntheticEvent, useState } from 'react';
import { GenericFormField } from '../../../containers';
import { FormSelectOption } from '../FormSelect';

export const useSelectAutocompleteEffects = (
  onChange: (newValue: FormSelectOption[]) => void,
  field: GenericFormField,
  currentValue: FormSelectOption[] = [],
) => {
  const [textValue, setTextValue] = useState<string>('');

  const add = (value: any) => {
    if (value) {
      const isDuplicate = currentValue?.indexOf(value) !== -1;

      if (isDuplicate) {
        setTextValue('');
        return;
      }
      onChange([...currentValue, value] as FormSelectOption[]);
      setTextValue('');
    }
  };

  const changeHandler = (
    _event: SyntheticEvent,
    value: (string | FormSelectOption)[],
  ) => {
    const maxValues = field.multiple ? field.maxValues : 1;
    const slicedValues = value
      ? (value as FormSelectOption[]).slice(0, maxValues ?? value.length)
      : (value as FormSelectOption[]);

    onChange(slicedValues);

    setTextValue('');
  };

  const onKeyDown = (event: any) => {
    if (event.key === 'Enter' && field.tags) {
      add(event.target.value);
    }
  };

  const onBlur = (event: any) => {
    add(event.target.value);
  };

  const options = field.options || [];

  return {
    options,
    textValue,
    setTextValue,
    changeHandler,
    onKeyDown,
    onBlur,
  };
};
