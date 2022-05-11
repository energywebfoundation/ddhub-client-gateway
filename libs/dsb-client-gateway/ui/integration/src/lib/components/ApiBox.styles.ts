import { makeStyles } from 'tss-react/mui';
import { alpha } from "@mui/material/styles";

export const useStyles = makeStyles()((theme) => ({
  avatar: {
    backgroundColor: alpha(theme.palette.primary.dark, 0.12),
    '& svg': {
      stroke: theme.palette.primary.dark,
    },
    '& path': {
      stroke: theme.palette.primary.dark,
    },
  },
  link: {
    backgroundColor: theme.palette.primary.main,
    padding: '10px 22px',
    borderRadius: '5px'
  }
}));
