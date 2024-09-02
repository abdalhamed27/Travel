import { teal } from '@mui/material/colors';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';

const drawerWidth = 240;

const CardHome = styled('div')(({ theme }) => ({
    minHeight:'95vh',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    backgroundRepeat:'no-repeat',
    backgroundSize:'cover'

  }));
  const Boxing = styled('div')(({ theme }) => ({
    background:' rgba(255, 255, 255, 0)',
    borderRadius:'16px',
    boxShadow:' 0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter:'blur(10.1px)',
    border:'1px solid rgba(255, 255, 255, 0.94)',
    width:'500px',
    height:'500px'
  }));
  const Heading= styled('div')(({ theme }) => ({
    fontWeight:"bold",
    color: teal[800],
    textAlign:'center',
    padding:'10px',
    fontSize:'3.25rem'
}));
const P2= styled('div')(({ theme }) => ({
    fontWeight:"500",
    color: teal[800],
    textAlign:'center',
    padding:'10px',
    fontSize:'1.25rem',
    lineHeight:'1.80rem'
}));
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  const BoxingSmall = styled('div')(({ theme }) => ({
    background:' rgba(255, 255, 255, 0)',
    borderRadius:'16px',
    boxShadow:' 0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter:'blur(10.1px)',
    border:'1px solid rgba(255, 255, 255, 0.94)',
    width:'200px',
    height:'200px'
  }));
  
  export {CardHome,Boxing,Heading,P2,DrawerHeader}