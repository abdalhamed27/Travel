'use client';

import React, { useState, MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function NavBarHome() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <Box
      sx={{
        marginTop: '40px',
        position: 'absolute',
        display: 'flex',
        top: 0,
        zIndex: 9999999999999,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="h2" sx={{ flexGrow: 1, color: '#FFF' }}>
          Global
        </Typography>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            background:isMobile ? 'transparent':'#2f404a' ,
            padding: '0 12px',
            color:'#FFF',
            borderRadius: '11px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
              
              <>
              <MenuItem>

  <Link
    href="/"
    className={`px-[15px] text-1xl ${
      isActive('/') ? 'text-yellow-400' : 'text-black'
    }`}
  >
    Home
  </Link>
  </MenuItem>
  <MenuItem>

  <Link
    href="/Trip"
    className={`px-[15px] text-1xl ${
      isActive('/Trip') ? 'text-yellow-400' : 'text-black'
    }`}
  >
    Trip
  </Link>
  </MenuItem>
  {session ? (
    <>
     
  <MenuItem>
      <Link
        href="/Contact"
        className={`px-[15px] text-1xl ${
          isActive('/Contact') ? 'text-yellow-400' : 'text-black'
        }`}
      >
        Contact
      </Link>
      </MenuItem>
      <MenuItem>
      <Link
        href="/profile"
        className={`px-[15px] text-1xl ${
          isActive('/profile') ? 'text-yellow-400' : 'text-black'
        }`}
      >
        Profile
      </Link>
      </MenuItem>
      <MenuItem>
      <Link
        href="/Tripcurrent"
        className={`px-[15px] text-1xl ${
          isActive('/Tripcurrent') ? 'text-yellow-400' : 'text-black'
        }`}
      >
        My Trips
      </Link>

      <Button
        onClick={() => signOut()}
        sx={{ px: '15px', color: 'black', fontSize: '1xl' }}
      >
        Sign out
      </Button>
      </MenuItem>
    </>
  ) : (
    <>
  <MenuItem>
      <Link
        href="/auth/login"
        className={`px-[15px] text-1xl ${
          isActive('/auth/login') ? 'text-yellow-400' : 'text-black'
        }`}
      >
        Login
      </Link>
      </MenuItem>
      <MenuItem>
      <Link
        href="/auth/register"
        className={`px-[15px] text-1xl ${
          isActive('/auth/register') ? 'text-yellow-400' : 'text-black'
        }`}
      >
        Register
      </Link>
      </MenuItem>
    </>
  )}
</>
              </Menu>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={`px-[15px] text-1xl ${
                  isActive('/') ? 'text-yellow-400' : 'text-white'
                }`}
              >
                Home
              </Link>
              <Link
                href="/Trip"
                className={`px-[15px] text-1xl ${
                  isActive('/Trip') ? 'text-yellow-400' : 'text-white'
                }`}
              >
                Trip
              </Link>

              {session ? (
                <>
                  <Link
                    href="/Contact"
                    className={`px-[15px] text-1xl ${
                      isActive('/Contact') ? 'text-yellow-400' : 'text-white'
                    }`}
                  >
                    Contact
                  </Link>
                  <Link
                    href="/profile"
                    className={`px-[15px] text-1xl ${
                      isActive('/profile') ? 'text-yellow-400' : 'text-white'
                    }`}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/Tripcurrent"
                    className={`px-[15px] text-1xl ${
                      isActive('/Tripcurrent')
                        ? 'text-yellow-400'
                        : 'text-white'
                    }`}
                  >
                    My Trips
                  </Link>

                  <Button
                    onClick={() => signOut()}
                    sx={{ px: '15px', color: 'white', fontSize: '1xl' }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className={`px-[15px] text-1xl ${
                      isActive('/auth/login')
                        ? 'text-yellow-400'
                        : 'text-white'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className={`px-[15px] text-1xl ${
                      isActive('/auth/register')
                        ? 'text-yellow-400'
                        : 'text-white'
                    }`}
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}
