import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    marginBottom: 9,
    borderRadius: 5,
    padding: '8px 11px 9px 6px !important',
    border: `1px solid ${theme.palette.grey[500]}`,
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
  accordion: {
    padding: 0,
    marginLeft: 8,
    width: 20,
    height: 20,
    '& svg': {
      stroke: theme.palette.text.secondary,
    },
  },
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
  copy: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  chip: {
    background: theme.palette.primary.main,
    height: 20,
    borderRadius: 4,
  },
  chipLabel: {
    fontSize: 10,
    lineHeight: '18px',
    fontWeight: 405,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
