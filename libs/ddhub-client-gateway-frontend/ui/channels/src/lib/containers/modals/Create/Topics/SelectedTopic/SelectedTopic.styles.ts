import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  name: {
    color: theme.palette.primary.main,
    fontSize: 14,
    lineHeight: '24px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
  },
  nameSecondary: {
    color: theme.palette.common.white,
    lineHeight: '21px',
  },
  owner: {
    color: theme.palette.grey[300],
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    marginTop: 1,
  },
  close: {
    width: 38,
    height: 38,
    border: '1px solid',
    borderColor: theme.palette.secondary.main,
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    '& svg': {
      stroke: theme.palette.secondary.main,
    },
  },
  copy: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
