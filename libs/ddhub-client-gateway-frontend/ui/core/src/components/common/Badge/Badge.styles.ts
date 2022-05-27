import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';

export const useStyles = makeStyles()((theme) => ({
  text: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.grey[300],
  },
  wrapper: {
    backgroundColor: alpha(theme.palette.success.main, 0.12),
    borderRadius: 4,
    padding: '1px 9px',
    marginTop: 7,
    width: 'fit-content',
  },
}));
