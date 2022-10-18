import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  navLink: {
    height: '42px',
    borderRadius: 5,
    marginBottom: 3,
    cursor: 'pointer',
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
  icon: {
    marginRight: 10,
  },
  clientIcon: {
    margin: '4px 12px 0px 2px',
  },
  subMenuIcon: {
    margin: '0 14px 0 4px',
  },
  menuIcon: {
    position: 'absolute',
    right: 4,
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.short,
    }),
  },
  menuIconActive: {
    transform: 'rotate(90deg)',
  },
  logo: {
    height: '38px',
    marginLeft: 7,
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  disc: {
    stroke: theme.palette.grey[600],
    marginRight: 10,
  },
  dividerColor: {
    backgroundColor: alpha(theme.palette.grey[600], 0.35),
    margin: '15px 0px 7px 0',
  },
  menuTitle: {
    marginLeft: '16px',
    marginBottom: '10px',
    fontSize: '14px',
    lineHeight: '18px',
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
