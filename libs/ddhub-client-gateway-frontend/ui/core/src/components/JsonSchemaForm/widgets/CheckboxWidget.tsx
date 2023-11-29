import { FocusEvent } from 'react';
import {
  ariaDescribedByIds,
  labelValue,
  schemaRequiresTrueValue,
  WidgetProps,
} from '@rjsf/utils';
import { useStyles } from '../../form/FormInput/FormInput.styles';
import { Checkbox, FormControlLabel, FormLabel } from '@mui/material';

/** The `CheckBoxWidget` is a widget for rendering boolean properties.
 *  It is typically used to represent a boolean.
 *
 * @param props - The `WidgetProps` for this component
 */
export const CheckboxWidget = (props: WidgetProps) => {
  const { classes } = useStyles();
  const {
    schema,
    id,
    value,
    disabled,
    readonly,
    label = '',
    hideLabel,
    autofocus,
    onChange,
    onBlur,
    onFocus,
  } = props;

  const required = schemaRequiresTrueValue(schema);

  const _onChange = (_: any, checked: boolean) => onChange(checked);
  const _onBlur = ({ target: { value } }: FocusEvent<HTMLButtonElement>) =>
    onBlur(id, value);
  const _onFocus = ({ target: { value } }: FocusEvent<HTMLButtonElement>) =>
    onFocus(id, value);

  return (
    <>
      {labelValue(
        <FormLabel className={classes.label} required={required} htmlFor={id}>
          {label || undefined}
        </FormLabel>,
        hideLabel
      )}
      <FormControlLabel
        classes={{
          root: classes.labelRoot,
          label: classes.formControlLabel,
        }}
        control={
          <Checkbox
            id={id}
            name={id}
            checked={typeof value === 'undefined' ? false : Boolean(value)}
            required={required}
            disabled={disabled || readonly}
            autoFocus={autofocus}
            onChange={_onChange}
            onBlur={_onBlur}
            onFocus={_onFocus}
            aria-describedby={ariaDescribedByIds(id)}
          />
        }
        label={undefined}
      />
    </>
  );
};
