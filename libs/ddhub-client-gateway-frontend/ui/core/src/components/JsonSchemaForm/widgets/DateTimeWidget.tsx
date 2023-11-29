import { WidgetProps } from '@rjsf/utils';
import {
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

const format = 'dd/MM/yyyy HH:mm:ss';
export const DateTimeWidget = (props: WidgetProps) => {
  const { theme, classes } = useStyles();

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
            if (
              !context.validationError &&
              !!value &&
              DateTime.isDateTime(value)
            ) {
              onChange(value.startOf('second').toISO());
            } else {
              onChange(null);
            }
          }}
          onAccept={(value: DateTime | null) => {
            if (value && DateTime.isDateTime(value)) {
              onChange(value.startOf('second').toISO());
            } else {
              onChange(null);
            }
          }}
          timezone="system"
          value={value ? DateTime.fromISO(value).startOf('second') : value}
          ampm={false}
          format={format}
          orientation="landscape"
          onOpen={() => {
            if (!value) {
              onChange(DateTime.local().startOf('second').toISO());
            }
          }}
          timeSteps={{
            seconds: 1,
            minutes: 1,
          }}
          views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
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
