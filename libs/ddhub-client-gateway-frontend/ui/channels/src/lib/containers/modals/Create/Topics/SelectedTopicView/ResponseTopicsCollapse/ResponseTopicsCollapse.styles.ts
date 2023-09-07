import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  chipLabel: {
    fontSize: 10,
    lineHeight: '18px',
    fontWeight: 405,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
  },
  noRecord: {
    background: alpha(theme.palette.info.main, 0.12),
    borderRadius: 4,
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
}));
