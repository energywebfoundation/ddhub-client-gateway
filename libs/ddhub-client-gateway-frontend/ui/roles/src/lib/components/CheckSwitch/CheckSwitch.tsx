import { FieldValues, UseFormRegister } from 'react-hook-form';
import { CheckSwitch as CheckSwitchComponent } from './CheckSwitch.styles';
import { FormControlLabel, FormGroup } from '@mui/material';

export interface CheckSwitchProps {
  register: UseFormRegister<FieldValues>;
  label: string;
  disabled?: boolean;
  defaultValue?: boolean;
  fieldName: string;
}

export const CheckSwitch = ({
  register,
  label,
  disabled = false,
  defaultValue = false,
  fieldName,
}: CheckSwitchProps) => {
  const { ref, name, onBlur, onChange } = register(fieldName);
  return (
    <FormGroup sx={{ alignItems: 'flex-start' }}>
      <FormControlLabel
        sx={{
          margin: 0,
          '& .MuiFormControlLabel-label': {
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '14px',
            color: '#fff',
          },
        }}
        control={
          <CheckSwitchComponent
            ref={ref}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disabled}
            defaultChecked={defaultValue}
          />
        }
        label={label}
        labelPlacement="start"
      />
    </FormGroup>
  );
};
