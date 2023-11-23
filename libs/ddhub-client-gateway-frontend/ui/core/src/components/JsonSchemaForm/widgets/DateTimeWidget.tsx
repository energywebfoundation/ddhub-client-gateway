import { WidgetProps } from '@rjsf/utils';
import {
  DateTimeValidationError,
  DesktopDateTimePicker,
  LocalizationProvider,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Box, InputLabel } from '@mui/material';
import { useStyles } from '../../form/FormInput/FormInput.styles';
import { DateTime } from 'luxon';
import { DateTimeIcon } from '../../icons';

const format = 'dd/MM/yyyy HH:mm:ss';
export const DateTimeWidget = (props: WidgetProps) => {
  const { classes } = useStyles();

  const { label, onChange, value } = props;

  return (
    <Box>
      {label && <InputLabel className={classes.label}>{label}</InputLabel>}
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DesktopDateTimePicker
          onChange={(
            value: DateTime | null,
            context: PickerChangeHandlerContext<DateTimeValidationError>
          ) => {
            if (!context.validationError && !!value) {
              onChange(value.toISO());
            }
          }}
          onAccept={(value: DateTime | null) => {
            if (value) {
              onChange(value.toISO());
            }
          }}
          timezone="system"
          value={value ? DateTime.fromISO(value) : value}
          ampm={false}
          format={format}
          orientation="landscape"
          views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
          slotProps={{
            textField: { classes: { root: classes.root } },
            nextIconButton: { sx: { color: 'white' } },
            previousIconButton: { sx: { color: 'white' } },
            switchViewButton: { sx: { color: 'white' } },
            openPickerButton: {
              sx: {
                mr: 1,
                color: 'white',
              },
            },
          }}
          slots={{
            openPickerIcon: () => <DateTimeIcon />,
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};
