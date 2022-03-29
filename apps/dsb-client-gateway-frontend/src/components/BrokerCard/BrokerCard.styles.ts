import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  mailIcon: {
    stroke: theme.palette.secondary.main,
  },
  avatar: {
    backgroundColor: alpha(theme.palette.secondary.main, 0.12),
  },
  status: {
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, 0.12),
    padding: '1px 4px',
    marginLeft: '16px',
    fontSize: "12px",
    lineHeight: '18px',
    borderRadius: '4px'
  }
}));
