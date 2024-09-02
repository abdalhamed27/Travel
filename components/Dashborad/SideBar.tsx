'use client';

import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Avatar,
  styled,
  useTheme,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Menu,
  Typography,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  AccountCircle,
  Settings as SettingsIcon,
  CalendarToday as CalendarTodayIcon,
  Support as SupportIcon,
  ExitToApp as ExitToAppIcon,
  Home as HomeIcon,
  ConnectingAirports as ConnectingAirportsIcon,
  StackedLineChart as StackedLineChartIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const drawerWidth = 240;

const openedMixin = (theme: any) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const HeaderContent = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }: { theme: any; open: boolean }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }: { theme: any; open: boolean; }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft:  drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface SideBarProps {
  onChangeTheme: () => void;
  lang: string;
}

const SideBar: React.FC<SideBarProps> = ({ onChangeTheme, lang }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const srcImage = session?.user?.profileImage;

  useEffect(() => {
    if (!session?.user) {
      router.replace('/auth/login');
    }
  }, [session, router]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const isMenuOpen = Boolean(anchorEl);

  return (
    <Box>
      <CssBaseline />
      <AppBar position="fixed" open={open}  style={{ background: theme.palette.primary.main }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar alt="Profile Image" src={srcImage || "/assets/img/theme/team-4-800x800.jpg"} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <ListItemButton onClick={handleMenuClose}>
              <AccountCircle />
              <Link href="/admin/profile" passHref>
                <Typography component="span" sx={{ ml: 2 }}>My profile</Typography>
              </Link>
            </ListItemButton>
            <ListItemButton onClick={handleMenuClose}>
              <SettingsIcon />
              <Link href="/admin/profile" passHref>
                <Typography component="span" sx={{ ml: 2 }}>Settings</Typography>
              </Link>
            </ListItemButton>
            <ListItemButton onClick={handleMenuClose}>
              <CalendarTodayIcon />
              <Link href="/admin/profile" passHref>
                <Typography component="span" sx={{ ml: 2 }}>Activity</Typography>
              </Link>
            </ListItemButton>
            <ListItemButton onClick={handleMenuClose}>
              <SupportIcon />
              <Link href="/admin/profile" passHref>
                <Typography component="span" sx={{ ml: 2 }}>Support</Typography>
              </Link>
            </ListItemButton>
            <ListItemButton onClick={() => {
              handleMenuClose();
              signOut();
            }}>
              <ExitToAppIcon />
              <Typography component="span" sx={{ ml: 2 }}>Logout</Typography>
            </ListItemButton>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" anchor={lang === 'ar' ? 'right' : 'left'} open={open}>
        <DrawerHeader>
          <HeaderContent>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            <IconButton onClick={onChangeTheme}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </HeaderContent>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { Name: 'Inbox', url: '/', icon: <HomeIcon /> },
            { Name: 'Trips', url: '/Trip', icon: <ConnectingAirportsIcon /> },
            { Name: 'Another Statistics', url: '/Owner', icon: <StackedLineChartIcon /> }
          ].map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <Link href={`/Dashboard${item.url}`} style={{ textDecoration: 'none', color: theme.palette.secondary.main }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.Name} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          <Divider />
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => signOut()}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default SideBar;
