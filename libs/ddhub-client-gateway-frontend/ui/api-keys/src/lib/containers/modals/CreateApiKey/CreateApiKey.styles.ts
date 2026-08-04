import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 514,
    minHeight: 466,
    padding: '37px 47px 35px 50px',
    borderRadius: 0,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18,
  },
  actions: {
    padding: 0,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    lineHeight: '34px',
    fontWeight: 500,
    fontFamily: theme.typography.body1.fontFamily,
    color: theme.palette.common.white,
  },
  label: {
    fontSize: 12,
    lineHeight: 'normal',
    fontWeight: 405,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    paddingBottom: 13,
  },
  roleOptionBox: {
    height: '100%',
    border: `1px solid #404656`,
    borderRadius: 5,
    padding: '10px 12px 12px',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, background-color 0.15s ease',
  },
  roleOptionBoxChecked: {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  roleCircleChecked: {
    borderRadius: '50%',
    fill: theme.palette.primary.main,
    boxShadow: `0px 2px 4px ${alpha(theme.palette.primary.dark, 0.4)}`,
  },
  roleLabelRoot: {
    marginRight: 0,
    alignItems: 'center',
    '& .Mui-checked ~ .MuiFormControlLabel-label': {
      color: theme.palette.common.white,
    },
  },
  roleFormControlLabel: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 600,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
  },
  roleSubLabel: {
    fontSize: 12,
    lineHeight: '16px',
    fontWeight: 405,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
    display: 'block',
  },
}));