import { alpha } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  root: {
    '.MuiGrid-root': {
      padding: '0 16px',
      '>.MuiGrid-item': {
        margin: '6px 0 !important',
        padding: '0 !important',
      },
    },
  },
}));
