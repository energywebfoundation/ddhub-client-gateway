import { makeStyles } from 'tss-react/mui';
import { keyframes } from '@emotion/react';
import { alpha } from '@mui/material/styles';

const zoom = keyframes`
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.6, 1.6);
  }
  100% {
    transform: scale(1, 1);
  }
`;

export const useStyles = makeStyles()((theme) => ({
  root: {
    zIndex: 2000,
    flexDirection: 'column',
    backgroundColor: alpha(theme.palette.info.dark, 0.88),
  },
  wrapper: {
    position: 'relative',
    width: 75,
    height: 75,
    marginBottom: 25,
  },
  logoWrapper: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 33,
    height: 33,
    animation: `${zoom} 1.4s infinite ease`,
  },
  text: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.grey[200],
  },
}));
