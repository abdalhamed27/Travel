'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getDesignTokens } from '@/theme'; // Adjust the path according to your project structure
import SideBar from '@/components/Dashborad/SideBar';

interface DashBoradLayoutsProps {
  children: React.ReactNode;
  // Optional prop if you need language params
  params?: {
    lang: string;
  };
}

const DashBoradLayouts: React.FC<DashBoradLayoutsProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
      if (savedMode) {
        setMode(savedMode);
      }
    }
  }, []);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('themeMode', newMode);
      }
      return newMode;
    });
  };

  const theme = useMemo(() => getDesignTokens(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <main style={{ display: 'flex', minHeight: '100vh', background: theme.palette.Second }}>
        {/* Uncomment and pass the necessary props to SideBar when needed */}
        <SideBar onChangeTheme={toggleColorMode} />
        <div style={{ marginTop: '20px', width: '100%' }}>
          {children}
        </div>
      </main>
    </ThemeProvider>
  );
};

export default DashBoradLayouts;
