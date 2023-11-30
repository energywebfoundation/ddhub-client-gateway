import { WidgetProps } from '@rjsf/utils';
import {
  DateOrTimeView,
  DateTimePickerToolbar,
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

const defaultFormat = 'dd/MM/yyyy HH:mm:ss';
const defaultViews: DateOrTimeView[] = [
  'year',
  'month',
  'day',
  'hours',
  'minutes',
  'seconds',
];
export const DateTimeWidget = (props: WidgetProps) => {
  const { theme, classes } = useStyles();
  const { label, onChange, value, options } = props;
  const withSeconds = options['withSeconds'] === false ? false : true;

  const views = !withSeconds
    ? defaultViews.slice(0, defaultViews.length - 1)
    : defaultViews;
  const format = !withSeconds ? 'dd/MM/yyyy HH:mm' : defaultFormat;
  const formatDateTimeToISO = (value: DateTime | null) => {
    if (DateTime.isDateTime(value)) {
      if (!withSeconds) {
        return value.startOf('minute').toISO();
      } else {
        return value.startOf('second').toISO();
      }
    }
    return null;
  };
  const buildDateTimeFromISO = (value: string | null) => {
    if (value) {
      const dateTime = DateTime.fromISO(value);
      if (dateTime.isValid) {
        if (!withSeconds) {
          return dateTime.startOf('minute');
        } else {
          return dateTime.startOf('second');
        }
      }
    }
    return null;
  };

  return (
    <Box>
      {label && <InputLabel className={classes.label}>{label}</InputLabel>}
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DesktopDateTimePicker
          onChange={(
            value: DateTime | null,
            context: PickerChangeHandlerContext<DateTimeValidationError>
          ) => {
            if (!context.validationError) {
              onChange(formatDateTimeToISO(value));
            }
          }}
          onAccept={(value: DateTime | null) => {
            onChange(formatDateTimeToISO(value));
          }}
          timezone="system"
          value={buildDateTimeFromISO(value)}
          ampm={false}
          format={format}
          orientation="portrait"
          onOpen={() => {
            if (!value) {
              onChange(formatDateTimeToISO(DateTime.local()));
            }
          }}
          timeSteps={{
            seconds: 1,
            minutes: 1,
          }}
          views={views}
          slots={{
            openPickerIcon: () => <DateTimeIcon />,
            toolbar: DateTimePickerToolbar,
          }}
          slotProps={{
            textField: { classes: { root: classes.root } },
            nextIconButton: { sx: { color: 'white' } },
            previousIconButton: { sx: { color: 'white' } },
            switchViewButton: { sx: { color: 'white' } },
            actionBar: {
              actions: ['today', 'clear'],
              sx: { justifyContent: 'flex-end' },
            },
            toolbar: {
              toolbarFormat: 'dd/MM/yyyy',
              hidden: false,
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
    </Box>
  );
};
