import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import React, { FC } from 'react';
import { theme }  from './theme';

export const DDHubThemeProvider: FC = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};
