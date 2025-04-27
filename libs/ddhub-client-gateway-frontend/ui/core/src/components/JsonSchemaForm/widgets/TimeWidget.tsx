import { WidgetProps } from '@rjsf/utils';
import { DesktopTimePicker, PickerChangeHandlerContext, DateTimeValidationError } from '@mui/x-date-pickers';
import { Box, InputLabel } from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useStyles } from '../../form/FormInput/FormInput.styles';
import { DateTime } from 'luxon';

export const TimeWidget = (props: WidgetProps) => {
  const { theme, classes } = useStyles();
  const { label, value, onChange } = props;

  const formatTime = (value: DateTime | null) => {
    if (DateTime.isDateTime(value)) {
      return value.toFormat('HH:mm:ss');
    }
    return null;
  };

  const buildTime = (value: string | null) => {
    if (value) {
      // Try parsing as ISO first
      let dateTime = DateTime.fromISO(value);
      if (!dateTime.isValid) {
        // If not valid ISO, try parsing as HH:mm:ss
        dateTime = DateTime.fromFormat(value, 'HH:mm:ss');
      }
      if (dateTime.isValid) {
        return DateTime.fromObject({
          hour: dateTime.hour,
          minute: dateTime.minute,
          second: dateTime.second
        });
      }
    }
    return null;
  };

  return (
    <Box>
      {label && <InputLabel className={classes.label}>{label}</InputLabel>}
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DesktopTimePicker
          onChange={(
            value: DateTime | null,
            context: PickerChangeHandlerContext<DateTimeValidationError>
          ) => {
            if (!context.validationError) {
              onChange(formatTime(value));
            }
          }}
          onAccept={(value: DateTime | null) => {
            onChange(formatTime(value));
          }}
          views={['hours', 'minutes', 'seconds']}
          format="HH:mm:ss"
          timeSteps={{
            seconds: 1,
            minutes: 1,
          }}
          ampm={false}
          value={buildTime(value)}
          slotProps={{
            textField: { classes: { root: classes.root } },
            openPickerButton: {
              sx: {
                mr: 1,
                color: theme.palette.primary.main,
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};
