"use client"
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const { data: session, status } = useSession();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const pathname = usePathname(); // Get the current pathname
  return (
    <AppBar position="static" sx={{ background: '#30404b' }} >
      <Toolbar>  
        {isMobile ? (
          <>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
                            <MenuItem >   <Link href={'/'} color="inherit" className='px-[20px] text-black text-1xl'>Home</Link></MenuItem>
                            <MenuItem>      <Link href={'/Trip'} color="inherit" className='px-[20px] text-black  text-1xl'  >Trip              </Link>
                            </MenuItem>
                 {session ? <>
                  <MenuItem> <Link href={'/profile'} color="inherit" className='px-[20px] text-black  text-1xl'  >Profile</Link>

                  </MenuItem>
                
                  <MenuItem>      <Link href={'/Tripcurrent'} color="inherit" className='px-[20px] text-black  text-1xl'  >My Trips              </Link>
                  </MenuItem>
                  <MenuItem>   <button onClick={() => signOut()} className='px-[20px] text-black  text-1xl'>Sign out</button>
                  </MenuItem>
             </>: <>
             <MenuItem>     <Link href={'/auth/login'} color="inherit" className='px-[20px] text-black  text-1xl'  >login</Link>
             </MenuItem>
             <MenuItem>      <Link href={'/auth/register'} color="inherit" className='px-[20px] text-black  text-1xl'  >register</Link>
             </MenuItem>
             </> 
     
            }
             
            </Menu>
          </>
        ) : (
          <>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              My Website
            </Typography>
            <Link href={'/'} color="inherit" className='px-[20px] text-white text-1xl'>Home</Link>
            <Link href={'/Trip'} color="inherit" className='px-[20px] text-white text-1xl'>Trip</Link>

            {session ? <>
              <Button color="inherit">Contact</Button>
              <Link href={'/profile'} color="inherit" className='px-[20px] text-white  text-1xl'  >Profile</Link>
              <Link href={'/Tripcurrent'} color="inherit" className='px-[20px] text-white  text-1xl'  >My Trips              </Link>

              <button onClick={() => signOut()} className='px-[20px] text-white  text-1xl'>Sign out</button>

             </>: <>
              <Link href={'/auth/login'} color="inherit" className='px-[20px] text-white  text-1xl'  >login</Link>
              <Link href={'/auth/register'} color="inherit" className='px-[20px] text-white  text-1xl'  >register</Link></> 
            }
         
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
