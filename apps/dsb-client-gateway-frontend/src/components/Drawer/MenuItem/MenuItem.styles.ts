import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  navLink: {
    height: '42px',
    borderRadius: 5,
    marginBottom: 3,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      color: theme.palette.primary.main,
    },
    '&:hover .MuiTypography-root': {
      color: theme.palette.primary.main,
    },
    '&:hover svg': {
      stroke: theme.palette.primary.main,
    },
  },
  active: {
    color: theme.palette.common.white,
    background: theme.palette.primary.main,
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
    },
    '& svg': {
      stroke: theme.palette.common.white,
    },
    '&:hover': {
      background: theme.palette.primary.main,
      transform: 'none',
      '& .MuiTypography-root': {
        color: theme.palette.common.white,
      },
      '& svg': {
        stroke: theme.palette.common.white,
      },
    },
  },
}));
