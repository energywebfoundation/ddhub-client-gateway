import { ChangeEvent, FocusEvent } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import {
  ariaDescribedByIds,
  enumOptionsDeselectValue,
  enumOptionsIsSelected,
  enumOptionsSelectValue,
  enumOptionsValueForIndex,
  labelValue,
  optionId,
  WidgetProps,
} from '@rjsf/utils';
import { useStyles } from '../../form/FormInput/FormInput.styles';

/** The `CheckboxesWidget` is a widget for rendering checkbox groups.
 *  It is typically used to represent an array of enums.
 *
 * @param props - The `WidgetProps` for this component
 */
export const CheckboxesWidget = ({
  label,
  hideLabel,
  id,
  disabled,
  options,
  value,
  autofocus,
  readonly,
  required,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) => {
  const { classes } = useStyles();
  const { enumOptions, enumDisabled, inline, emptyValue } = options;
  const checkboxesValues = Array.isArray(value) ? value : [value];

  const _onChange =
    (index: number) =>
    ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
      if (checked) {
        onChange(enumOptionsSelectValue(index, checkboxesValues, enumOptions));
      } else {
        onChange(
          enumOptionsDeselectValue(index, checkboxesValues, enumOptions),
        );
      }
    };

  const _onBlur = ({ target: { value } }: FocusEvent<HTMLButtonElement>) =>
    onBlur(id, enumOptionsValueForIndex(value, enumOptions, emptyValue));
  const _onFocus = ({ target: { value } }: FocusEvent<HTMLButtonElement>) =>
    onFocus(id, enumOptionsValueForIndex(value, enumOptions, emptyValue));

  return (
    <>
      {labelValue(
        <FormLabel className={classes.label} required={required} htmlFor={id}>
          {label || undefined}
        </FormLabel>,
        hideLabel,
      )}
      <FormGroup id={id} row={!!inline}>
        {Array.isArray(enumOptions) &&
          enumOptions.map((option, index: number) => {
            const checked = enumOptionsIsSelected(
              option.value,
              checkboxesValues,
            );
            const itemDisabled =
              Array.isArray(enumDisabled) &&
              enumDisabled.indexOf(option.value) !== -1;
            const checkbox = (
              <Checkbox
                id={optionId(id, index)}
                name={id}
                checked={checked}
                disabled={disabled || itemDisabled || readonly}
                autoFocus={autofocus && index === 0}
                onChange={_onChange(index)}
                onBlur={_onBlur}
                onFocus={_onFocus}
                aria-describedby={ariaDescribedByIds(id)}
              />
            );
            return (
              <FormControlLabel
                control={checkbox}
                key={index}
                label={option.label}
                classes={{
                  root: classes.labelRoot,
                  label: classes.formControlLabel,
                }}
              />
            );
          })}
      </FormGroup>
    </>
  );
};
