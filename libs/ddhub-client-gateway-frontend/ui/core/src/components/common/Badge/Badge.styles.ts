import { makeStyles } from 'tss-react/mui';
import { alpha, PaletteColor, Theme } from '@mui/material';
import { BadgeText } from './Badge';
export const useStyles = (
  statusColor: (
    theme: Theme,
    badgeText: BadgeText
  ) => Pick<PaletteColor, 'main'>,
  badgeText: BadgeText
) =>
  makeStyles()((theme) => {
    const color = statusColor(theme, badgeText);
    return {
      wrapper: {
        borderRadius: 4,
        backgroundColor: alpha(color.main, 0.12),
        padding: '1px 9px',
        width: 'fit-content',
      },
      text: {
        fontSize: 12,
        lineHeight: '18px',
        fontWeight: 400,
        color: color.main,
      },
    };
  })();
