import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 860,
    minHeight: 693,
    padding: '48px 40px 40px 48px',
    borderRadius: 0,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18,
  },
  actions: {
    padding: 0,
    marginTop: 10,
  },
  icon: {
    stroke: theme.palette.primary.main,
    width: 16,
    height: 16,
  },
  downloadIconButton: {
    position: 'absolute',
    top: 10,
    right: 0,
  },
  selectValue: {
    color: theme.palette.grey[300],
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 405,
  },
  content: {
    height: '100%',
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  contentWrapper: {
    paddingTop: 48,
    flexGrow: 1,
  },
  details: {
    position: 'relative',
  },
  appWrapper: {
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'start',
  },
  title: {
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.h2.fontFamily,
    margin: '15px 0 6px 0',
  },
  label: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 1,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    textAlign: 'center',
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
  },
}));
