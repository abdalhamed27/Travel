"use client";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { green, purple } from "@mui/material/colors";
import React from "react";
import Navbar from "./front/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Define the custom theme
import { usePathname } from 'next/navigation';
import SessionWrapper from "./SessionWrapper";

const theme = createTheme({
  palette: {
    primary: {
      main: '#00c6cf',
    },
    secondary: {
      main: green[500],
    },
  },
});

// Create a client component to provide the theme
export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current pathname
  let nav=null
  {pathname =="/" ?   null:nav=<Navbar />  }
  return (
    <ThemeProvider theme={theme}>
              <ToastContainer />
      <CssBaseline />
      {nav}
      
      {children}
    </ThemeProvider>
  );
}
