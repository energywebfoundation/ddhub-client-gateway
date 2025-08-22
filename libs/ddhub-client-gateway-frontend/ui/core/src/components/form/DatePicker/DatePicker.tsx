import { FC } from 'react';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { useStyles } from '../FormInput/FormInput.styles';

export interface DateInputProps {
  inputDate: DateTime | null;
  onChange: (date: DateTime | null) => void;
  isDirty: boolean;
  error: string;
  placeholder?: string;
  minDate?: DateTime;
}

export const DatePicker: FC<DateInputProps> = (props) => {
  const { classes } = useStyles();

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DesktopDatePicker
        value={props.inputDate}
        onChange={props.onChange}
        format="dd-MM-yyyy"
        minDate={props.minDate}
        slotProps={{
          textField: {
            fullWidth: true,
            variant: 'outlined',
            autoComplete: 'off',
            placeholder: props.placeholder ?? 'Select date',
            error: props.isDirty && !props.inputDate,
            helperText: props.isDirty && !props.inputDate ? props.error : '',
            classes: { root: classes.root },
          },
          openPickerButton: {
            sx: {
              mr: -0.5,
            },
          },
          day: {
            sx: {
              '&.MuiPickersDay-root.Mui-disabled': {
                color: 'rgba(128, 128, 128, 0.6)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            },
          },
          nextIconButton: {
            sx: {
              color: 'white',
              '&.Mui-disabled': {
                color: 'rgba(128, 128, 128, 0.6)',
              },
            },
          },
          previousIconButton: {
            sx: {
              color: 'white',
              '&.Mui-disabled': {
                color: 'rgba(128, 128, 128, 0.6)',
              },
            },
          },
          switchViewButton: {
            sx: {
              color: 'white',
            },
          },
        }}
         slots={{
           openPickerIcon: () => (
             <img 
               src="/icons/date-picker.svg" 
               alt="Select date"
               style={{ width: 20, height: 20, filter: 'brightness(0) saturate(100%) invert(67%) sepia(8%) saturate(1037%) hue-rotate(202deg) brightness(89%) contrast(86%)' }}
             />
           ),
         }}
      />
    </LocalizationProvider>
  );
};
