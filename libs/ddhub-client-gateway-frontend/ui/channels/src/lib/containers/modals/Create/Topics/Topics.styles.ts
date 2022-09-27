import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
  },
  noRecord: {
    background: alpha(theme.palette.info.main, 0.12),
    borderRadius: 4,
    marginBottom: 38,
  },
  noRecordLabel: {
    fontFamily: theme.typography.body2.fontFamily,
    fontSize: 12,
    lineHeight: '21px',
    color: theme.palette.info.main,
    padding: '9px 14px 10px 14px',
  },
  filterLabel: {
    fontSize: 10,
    lineHeight: '12px',
    fontWeight: 405,
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
    cursor: 'pointer',
  },
  restrictionsLabel: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 8,
  },
}));
