import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  navLink: {
    height: '42px',
    borderRadius: 5,
    marginBottom: 3,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      color: theme.palette.primary.main
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
      }
    },
  },
  icon: {
    marginRight: 10,
  },
  subMenuIcon: {
    margin: '0 14px 0 4px'
  },
  menuIcon: {
    position: 'absolute',
    right: 4,
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.short,
    }),
  },
  menuIconActive: {
    transform: 'rotate(90deg)'
  },
  listItemText: {
    fontSize: 15,
    lineHeight: '24px',
    fontWeight: 500,
    color: theme.palette.grey[200],
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
