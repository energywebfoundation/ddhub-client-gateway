import { makeStyles } from 'tss-react/mui';
import { lighten } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  title: {
    fontSize: 18,
    lineHeight: '22px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    paddingBottom: 6,
    borderBottom: `1px solid ${lighten(theme.palette.background.paper, 0.07)}`,
  },
  content: {
    height: '100%',
    flexGrow: 1,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[300],
    paddingTop: 26,
    paddingBottom: 10,
  },
  details: {
    marginTop: 36,
    position: 'relative',
  },
  detailsInfo: {
    marginTop: 15,
  },
  detailsInfoLabel: {
    fontSize: 12,
    lineHeight: '24px',
    fontWeight: 400,
    color: theme.palette.common.white,
    marginRight: 20,
  },
  detailsInfoValue: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    color: theme.palette.grey[300],
  },
  contentWrapper: {
    minWidth: '540px',
    paddingTop: 48,
    flexGrow: 1,
    paddingLeft: 63,
  },
}));
