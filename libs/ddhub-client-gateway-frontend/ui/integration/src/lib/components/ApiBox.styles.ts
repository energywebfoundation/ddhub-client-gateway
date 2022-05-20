import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  card: {
    borderRadius: 6,
  },
  avatar: {
    backgroundColor: alpha(theme.palette.primary.dark, 0.12),
    '& svg': {
      stroke: theme.palette.primary.dark,
    },
    '& path': {
      stroke: theme.palette.primary.dark,
    },
    width: 48,
    height: 48,
    marginRight: 5,
  },
  cardHeader: {
    padding: '39px 121px 39px 29px'
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: '21px',
    paddingBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: '18px'
  },
  cardContent: {
    padding: '12px 21px 24px 21px',
  },
  link: {
    backgroundColor: theme.palette.primary.main,
    padding: '10px 22px',
    borderRadius: '5px',
    height: 37,
    minWidth: 75,
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    cursor: 'pointer',
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  },
}));
