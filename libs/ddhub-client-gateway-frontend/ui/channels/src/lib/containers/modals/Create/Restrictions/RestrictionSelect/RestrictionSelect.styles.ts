import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';
import { darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  form: {
    display: 'flex',
    height: '100%',
    padding: '12px 16px 20px 18px',
  },
  formContent: {
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
    '&.MuiGrid-item': {
      paddingTop: 11,
      paddingBottom: 1,
    },
  },
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 8,
  },
  cancelButton: {
    height: 37,
    minWidth: 87,
    textTransform: 'capitalize',
    padding: '10px 22px',
    justifyContent: 'center',
    border: `1px solid ${theme.palette.primary.main}`,
    margin: '0 16px 0 auto',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
  },
  buttonTextSave: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  },
  saveButton: {
    height: 37,
    minWidth: 95,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
      boxShadow: `0px 0px 10px ${alpha(theme.palette.primary.main, 0.65)}`,
    },
    '&.Mui-disabled': {
      '& .MuiButton-endIcon svg': {
        stroke: alpha(theme.palette.common.black, 0.26),
      },
      '& .MuiTypography-root': {
        color: alpha(theme.palette.common.black, 0.26),
      },
    },
  },
}));
