import { WidgetProps } from '@rjsf/utils';
import {
  DesktopDateTimePicker,
  DesktopDatePicker,
  LocalizationProvider,
  PickerChangeHandlerContext,
  DateTimeValidationError,
  PickersActionBarAction,
  DateOrTimeView
} from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Box, InputLabel } from '@mui/material';
import { useStyles } from '../../form/FormInput/FormInput.styles';
import { DateTimeIcon } from '../../icons';
import { DateTime } from 'luxon';

const defaultFormat = 'yyyy-MM-dd HH:mm:ss';
const dateFormat = 'yyyy-MM-dd';

export const DateTimeWidget = (props: WidgetProps) => {
  const { theme, classes } = useStyles();
  const { label, value, onChange, schema, options } = props;
  const isDateOnly = schema.format === 'date';
  const isLocalDateTime = schema.format === 'local-date-time';
  const withSeconds = options['withSeconds'] === false ? false : true;
  const datetimeFormat = !withSeconds ? 'yyyy-MM-dd HH:mm' : defaultFormat;

  const defaultViews: DateOrTimeView[] = [
    'year',
    'month',
    'day',
    'hours',
    'minutes',
    'seconds',
  ];

  const views = !withSeconds
  ? defaultViews.slice(0, defaultViews.length - 1)
  : defaultViews;

  const formatDateTimeToISO = (value: DateTime | null) => {
    if (DateTime.isDateTime(value)) {
      if (isDateOnly) {
        return value.toISODate();
      }

      const dateTime = withSeconds ? value.startOf('second') : value.startOf('minute');

      return isLocalDateTime ? dateTime.startOf('minute').toISO() : dateTime.startOf('second').toUTC().toISO();
    }
    return null;
  };

  const buildDateTimeFromISO = (value: string | null) => {
    if (value) {
      if (isDateOnly) {
        const dateOnly = DateTime.fromISO(value);
        return dateOnly.isValid ? dateOnly : null;
      }

      const dateTime = isLocalDateTime ? DateTime.fromISO(value) : DateTime.fromISO(value, { zone: 'utc' });
      if (dateTime.isValid) {
        return withSeconds ? dateTime.startOf('second') : dateTime.startOf('minute');
      }
    }
    return null;
  };

  const commonProps = {
    onChange: (
      value: DateTime | null,
      context: PickerChangeHandlerContext<DateTimeValidationError>
    ) => {
      if (!context.validationError) {
        onChange(formatDateTimeToISO(value));
      }
    },
    onAccept: (value: DateTime | null) => {
      onChange(formatDateTimeToISO(value));
    },
    timezone: "system",
    format: isDateOnly ? dateFormat : datetimeFormat,
    orientation: "portrait",
    slots: {
      openPickerIcon: () => <DateTimeIcon />,
    },
    value: buildDateTimeFromISO(value),
    slotProps: {
      textField: { classes: { root: classes.root } },
      nextIconButton: { sx: { color: 'white' } },
      previousIconButton: { sx: { color: 'white' } },
      switchViewButton: { sx: { color: 'white' } },
      actionBar: {
        actions: ['today', 'clear'] as PickersActionBarAction[],
        sx: { justifyContent: 'flex-end' },
      },
      toolbar: {
        toolbarFormat: dateFormat,
        hidden: !isLocalDateTime,
      },
      openPickerButton: {
        sx: {
          mr: 1,
          color: theme.palette.primary.main,
        },
      },
    },
  } as const;

  return (
    <Box>
      {label && <InputLabel className={classes.label}>{label}</InputLabel>}
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        {isDateOnly ? (
          <DesktopDatePicker {...commonProps} />
        ) : (
          <DesktopDateTimePicker
            {...commonProps}
            timeSteps={{
              seconds: 1,
              minutes: 1,
            }}
            ampm={false}
            views={views}
          />
        )}
      </LocalizationProvider>
    </Box>
  );
};
