import { createTheme, Theme, PaletteOptions } from '@mui/material/styles';

// Extend the Palette interface to include your custom properties
declare module '@mui/material/styles' {
  interface Palette {
    Second: string;
  }
  interface PaletteOptions {
    Second?: string;
  }
}

export const getDesignTokens = (mode: 'light' | 'dark'): Theme => 
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { 
              main: '#30404b',
              light: '#fff',
            },
            Second: '#9bb5c1',
            secondary: {
              main: '#30404b',
            },
          }
        : {
            primary: {
              main: '#444348',
              light: '#fff',
            },
            Second: '#222124',
            secondary: {
              main: '#fff',
            },
          }),
    },
  });
