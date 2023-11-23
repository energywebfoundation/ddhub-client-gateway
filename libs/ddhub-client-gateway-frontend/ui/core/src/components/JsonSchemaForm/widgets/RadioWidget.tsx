import { FocusEvent } from 'react';
import {
  WidgetProps,
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  labelValue,
  optionId,
} from '@rjsf/utils';
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useStyles } from '../../form/FormInput/FormInput.styles';
import { Circle } from 'react-feather';

/** The `RadioWidget` is a widget for rendering a radio group.
 *  It is typically used with a string property constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
export const RadioWidget = ({
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  label,
  hideLabel,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) => {
  const { classes } = useStyles();

  const { enumOptions, enumDisabled, emptyValue } = options;

  const _onChange = (_: any, value: any) =>
    onChange(enumOptionsValueForIndex(value, enumOptions, emptyValue));
  const _onBlur = ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
    onBlur(id, enumOptionsValueForIndex(value, enumOptions, emptyValue));
  const _onFocus = ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
    onFocus(id, enumOptionsValueForIndex(value, enumOptions, emptyValue));

  const row = options ? options.inline : false;
  const selectedIndex = enumOptionsIndexForValue(value, enumOptions) ?? null;

  return (
    <>
      {labelValue(
        <FormLabel className={classes.label} required={required} htmlFor={id}>
          {label || undefined}
        </FormLabel>,
        hideLabel,
      )}
      <RadioGroup
        id={id}
        name={id}
        value={selectedIndex}
        row={row as boolean}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        aria-describedby={ariaDescribedByIds(id)}
      >
        {Array.isArray(enumOptions) &&
          enumOptions.map((option, index) => {
            const itemDisabled =
              Array.isArray(enumDisabled) &&
              enumDisabled.indexOf(option.value) !== -1;
            const radio = (
              <FormControlLabel
                control={
                  <Radio
                    name={id}
                    id={optionId(id, index)}
                    color="primary"
                    icon={<Circle size={18} />}
                    checkedIcon={
                      <Circle size={18} className={classes.circle} />
                    }
                  />
                }
                label={option.label}
                classes={{
                  root: classes.labelRoot,
                  label: classes.formControlLabel,
                }}
                value={String(index)}
                key={index}
                disabled={disabled || itemDisabled || readonly}
              />
            );

            return radio;
          })}
      </RadioGroup>
    </>
  );
};
