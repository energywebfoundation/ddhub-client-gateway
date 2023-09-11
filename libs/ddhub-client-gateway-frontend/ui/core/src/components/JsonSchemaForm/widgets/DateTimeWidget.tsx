import { WidgetProps } from '@rjsf/utils';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Box, InputLabel, TextField } from '@mui/material';
import { useStyles } from '../../form/FormInput/FormInput.styles';
import { DateTime } from 'luxon';
import { DateTimeIcon } from '../../icons';
export const DateTimeWidget = (props: WidgetProps) => {
  const { classes } = useStyles();

  const { label, onChange, value } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DateTimePicker
        onChange={(value: DateTime | null) =>
          onChange(value ? value.toISO() : null)
        }
        value={value}
        ampm={false}
        renderInput={(params) => (
          <Box flexShrink={0}>
            {label && (
              <InputLabel className={classes.label}>{label}</InputLabel>
            )}
            <TextField
              classes={{
                root: classes.root,
              }}
              {...params}
            />
          </Box>
        )}
        OpenPickerButtonProps={{
          sx: {
            mr: 1,
            color: 'white',
          },
        }}
        components={{
          OpenPickerIcon: () => <DateTimeIcon />,
        }}
      />
    </LocalizationProvider>
  );
};
