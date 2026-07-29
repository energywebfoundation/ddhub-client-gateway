import { FC } from 'react';
import {
  DesktopDatePicker,
  LocalizationProvider,
  PickerChangeHandlerContext,
  DateTimeValidationError,
  PickersActionBarAction,
} from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { DateTimeIcon } from '../../icons';
import { useStyles } from '../FormInput/FormInput.styles';

export interface DatePickerProps {
  inputDate: DateTime | null;
  onChange: (value: DateTime | null) => void;
  isDirty?: boolean;
  error?: string;
  minDate?: DateTime;
}

export const DatePicker: FC<DatePickerProps> = ({
  inputDate,
  onChange,
  isDirty,
  error,
  minDate,
}) => {
  const { theme, classes } = useStyles();

  const handleChange = (
    value: DateTime | null,
    context: PickerChangeHandlerContext<DateTimeValidationError>
  ) => {
    if (!context.validationError) {
      onChange(value);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DesktopDatePicker
        value={inputDate}
        onChange={handleChange}
        minDate={minDate}
        format="dd/MM/yyyy"
        timezone="system"
        slots={{
          openPickerIcon: () => <DateTimeIcon />,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            classes: { root: classes.root },
            error: Boolean(isDirty && error),
            helperText: isDirty ? error : '',
          },
          nextIconButton: { sx: { color: 'white' } },
          previousIconButton: { sx: { color: 'white' } },
          switchViewButton: { sx: { color: 'white' } },
          actionBar: {
            actions: ['today', 'clear'] as PickersActionBarAction[],
            sx: { justifyContent: 'flex-end' },
          },
          openPickerButton: {
            sx: {
              mr: 1,
              color: theme.palette.primary.main,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
