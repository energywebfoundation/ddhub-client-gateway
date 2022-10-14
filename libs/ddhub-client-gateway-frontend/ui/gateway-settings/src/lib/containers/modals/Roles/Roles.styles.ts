import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  paper: {
    maxWidth: 860,
    minHeight: 693,
    padding: '48px 40px 40px 48px',
    borderRadius: 0,
  },
  content: {
    height: '100%',
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  contentWrapper: {
    minWidth: '450px',
    paddingTop: 48,
    flexGrow: 1,
    paddingLeft: 20,
  },
  infoWrapper: {
    display: 'flex',
    placeItems: 'start',
    flexDirection: 'column',
  },
  title: {
    fontSize: 28,
    lineHeight: '34px',
    fontWeight: 500,
    fontFamily: theme.typography.body1.fontFamily,
    color: theme.palette.common.white,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 17,
    right: 18,
  },
  did: {
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 500,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
  },
  label: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    marginBottom: 1,
  },
  value: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.grey[400],
    fontFamily: theme.typography.body2.fontFamily,
    maxWidth: 224,
    alignSelf: 'center',
  },
}));
