import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';
import { darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  name: {
    color: theme.palette.common.white,
    fontSize: 12,
    lineHeight: '18px',
  },
  nameSecondary: {
    color: theme.palette.common.white,
    lineHeight: '21px',
  },
  owner: {
    color: theme.palette.grey[300],
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 405,
    fontFamily: theme.typography.body2.fontFamily,
    marginTop: 1.5,
  },
  close: {
    width: 20,
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    '& svg': {
      stroke: theme.palette.warning.main,
    },
  },
  copy: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    top: 8,
    right: 13,
    stroke: alpha(theme.palette.grey[100], 0.5),
    width: 20,
    '&.Mui-disabled': {
      stroke: theme.palette.grey[500],
    },
  },
  select: {
    marginBottom: 9,
    borderRadius: 5,
    '&.MuiInputBase-root': {
      fontFamily: theme.typography.body2.fontFamily,
      fontSize: 12,
      lineHeight: '24px',
      fontWeight: 400,
      color: theme.palette.common.white,
      width: '100%',
      '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${theme.palette.grey[500]}`,
      },
    },
    '& .MuiSelect-select': {
      padding: '8px 11px 9px 6px !important',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #404656',
      borderRadius: 5,
    },
    '&:nth-of-type(even)': {
      background: '#32374A',
    },
  },
  recent: {
    border: `1px solid ${theme.palette.common.white}`,
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
    },
  },
  appBox: {
    border: '1px solid #373C4D',
    borderRadius: 4,
    background: '#343559',
  },
  appName: {
    color: theme.palette.common.white,
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 405,
    fontFamily: theme.typography.body2.fontFamily,
    padding: '3px 8px 5px 10px',
  },
  edit: {
    padding: 0,
    marginRight: 13,
    width: 20,
    height: 20,
    '& svg': {
      stroke: theme.palette.primary.main,
    },
  },
  editInactive: {
    '& svg': {
      stroke: theme.palette.grey[500],
    },
  },
  editActive: {
    '& svg': {
      stroke: theme.palette.text.secondary,
    },
  },
  optionTitle: {
    fontSize: 12,
    lineHeight: '14px',
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.text.secondary,
    padding: '12px 18px 14px 18px',
    fontWeight: 405,
    borderBottom: '1px solid #404656',
  },
  topic: {
    padding: '8px 18px 14px 18px',
    borderBottom: '1px solid #404656',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      color: theme.palette.primary.main,
    },
    '&:hover .MuiTypography-root': {
      color: theme.palette.primary.main,
    },
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
    }
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
  selected: {
    border: `1px solid ${theme.palette.common.white}`,
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
    },
  },
  noRecord: {
    background: alpha(theme.palette.info.main, 0.12),
    borderRadius: 4,
    marginTop: 9,
  },
  noRecordLabel: {
    fontFamily: theme.typography.body2.fontFamily,
    fontSize: 12,
    lineHeight: '21px',
    color: theme.palette.info.main,
    padding: '9px 14px 10px 14px',
  },
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
