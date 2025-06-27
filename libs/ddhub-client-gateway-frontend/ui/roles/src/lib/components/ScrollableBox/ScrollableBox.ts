import { Box, styled } from '@mui/material';
import { CSSProperties } from 'react';

export const ScrollableBox = styled(Box)<{
  maxHeight?: CSSProperties['maxHeight'];
}>(({ theme, maxHeight }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  paddingRight: '10px',
  maxHeight: maxHeight || '235px',
  overflowY: 'auto',
  // Firefox
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
  // Chrome, Safari, Edge
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
  },
  // IE
  'scrollbar-face-color': theme.palette.primary.main,
  'scrollbar-track-color': theme.palette.background.default,
  'scrollbar-arrow-color': theme.palette.primary.main,
  'scrollbar-shadow-color': theme.palette.primary.main,
}));
