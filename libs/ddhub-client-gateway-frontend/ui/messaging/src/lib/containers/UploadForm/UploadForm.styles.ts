import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 5,
    minHeight: 189,
    padding: '23px 21px 26px 21px',
  },
  label: {
    fontSize: 18,
    lineHeight: '22px',
    fontWeight: 500,
    color: theme.palette.text.primary,
  }
}));
