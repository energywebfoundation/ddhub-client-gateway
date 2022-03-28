import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  status: {
    padding: '1px 4px',
    marginLeft: '16px',
    fontSize: "12px",
    lineHeight: '18px',
    borderRadius: '4px'
  },
  success: {
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, 0.12),
  },
  failure: {
    color: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.12),
  }
}));
