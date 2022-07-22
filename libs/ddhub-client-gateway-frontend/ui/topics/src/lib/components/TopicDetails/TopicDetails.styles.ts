import { makeStyles } from 'tss-react/mui';
import { alpha, lighten } from '@mui/material/styles';

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
  progress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    position: 'absolute',
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
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
    marginRight: 20,
    fontFamily: theme.typography.body2.fontFamily,
  },
  tag: {
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 400,
    color: theme.palette.primary.main,
    padding: '1px 9px',
    margin: '2px 3px',
    borderRadius: 4,
    background: alpha(theme.palette.primary.main, 0.12),
    fontFamily: theme.typography.body2.fontFamily,
  },
  detailsInfoValue: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
  },
  content: {
    height: '100%',
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  contentWrapper: {
    minWidth: '474px',
    paddingTop: 48,
    flexGrow: 1,
    marginLeft: 44,
  },
  gridItem: {
    flexGrow: 1,
    paddingTop: '10px !important',
  },
  leftPanel: {
    width: 300,
  }
}));
