import { memo, FC } from 'react';
import {
  InputAdornment,
  TextField,
  Box,
  InputLabel,
  Typography,
} from '@mui/material';
import { useStyles } from './ViewPasswordInput.styles';

export interface CustomFormInputProps {
  field: {
    endAdornment?: {
      element: React.ReactNode;
      isValidCheck?: boolean;
    };
    textFieldProps?: any;
    helperText?: string;
  };
  type?: string;
  value?: string;
}

export const ViewPasswordInput: FC<CustomFormInputProps> = memo(
  ({ field, value, type = 'text' }) => {
    const { classes, theme } = useStyles();

    return (
      <Box sx={{ marginBottom: '2px' }}>
        <InputLabel className={classes.label}>Password</InputLabel>
        <TextField
          fullWidth
          margin="none"
          type={type}
          variant="outlined"
          value={value}
          classes={{
            root: classes.root,
          }}
          disabled
          helperText={
            field.helperText && (
              <Typography
                sx={{
                  fontSize: 12,
                  lineHeight: '14px',
                  fontWeight: 400,
                  fontFamily: theme.typography.body2.fontFamily,
                  color: theme.palette.grey[300],
                }}
              >
                {field.helperText}
              </Typography>
            )
          }
          InputProps={{
            endAdornment: field.endAdornment?.element && (
              <InputAdornment position="end">
                {field.endAdornment?.element}
              </InputAdornment>
            ),
          }}
          {...field.textFieldProps}
        />
      </Box>
    );
  }
);
