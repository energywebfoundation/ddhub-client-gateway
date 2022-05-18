import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'Medium',
    fontSize: '24px',
    marginBottom: 22,
  },
  pageTitle: {
    marginRight: 16,
    fontSize: '24px',
    lineHeight: '29px',
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontFamily: theme.typography.body1.fontFamily,
  },
  line: {
    width: 1,
    height: 26,
    background: theme.palette.text.primary,
  },
  breadCrumbs: {
    marginLeft: 18,
    lineHeight: '29px',
    '& .MuiBreadcrumbs-li': {
      display: 'flex',
    },
  },
  element: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
    letterSpacing: '0.4px',
  },
  lastElement: {
    color: theme.palette.text.primary,
  },
  image: {
    objectFit: 'cover',
    width: 25,
    height: 25,
    marginRight: 12,
  },
}));
