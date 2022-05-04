import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  icon: {
    width: 18,
    height: 18,
    stroke: theme.palette.primary.main,
  },
  iconButton: {
    padding: '0 0 0 8px',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  tooltip: {
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.common.white,
    letterSpacing: '0.4px',
    '&.MuiTooltip-tooltipPlacementTop.MuiTooltip-tooltipArrow': {
      marginBottom: 6
    }
  }
}));
