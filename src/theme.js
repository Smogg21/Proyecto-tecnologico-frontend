// src/theme.js
import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Paleta para modo claro
          primary: {
            main: '#1976d2',
          },
          background: {
            default: '#ffffff',
            paper: '#f5f5f5',
          },
        }
      : {
          // Paleta para modo oscuro
          primary: {
            main: '#90caf9',
          },
          background: {
            default: '#121212',
            paper: '#1d1d1d',
          },
        }),
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
