import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 860,
    minHeight: 600,
    maxHeight: 800,
    padding: '39px 20px 0px 39px',
    borderRadius: 0,
  },
  title: {
    fontSize: 28,
    lineHeight: '34px',
    fontWeight: 500,
    fontFamily: theme.typography.h2.fontFamily,
    color: theme.palette.common.white,
    marginBottom: 8,
  },
  nextButtonWrapper: {
    textTransform: 'none',
    fontFamily: theme.typography.body2.fontFamily,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '20px',
  },
  backButtonWrapper: {
    color: '#F6AFAF',
    borderColor: '#F6AFAF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    padding: '10px 20px',
    fontFamily: theme.typography.body2.fontFamily,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '20px',
    textTransform: 'none',
    '&:hover': {
      borderColor: '#F6AFAF',
    },
  },
}));
