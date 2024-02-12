
import DashboardIcon from '@mui/icons-material/Dashboard';
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';


import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../../const/queries"
import { logOut } from "../../api/auth"
import { Outlet, useLocation } from 'react-router-dom';
import { Breadcrumbs, Link, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink  } from 'react-router-dom'
import { HomeRepairService, Inventory2, LocationOn } from '@mui/icons-material';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const defaultTheme = createTheme();


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.




export const Layout =()=>{

    const queryClient = useQueryClient()
    const {pathname} = useLocation()
    // console.log(pathname)
        
    const paths=   pathname.split("/")
    const finalpaths = paths.map((current, index, full)=>{
        return { 
          label:current==="" ? "Home" : current ,
          link: `/${full.slice(1, index+1).join("/")}`
        }
    })
    
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
      setOpen(!open);
    };

    


    const breadcrumbslinks = finalpaths.map((path, index, full)=>{

      const len = full.length

      if( index+1 === len){
        return <Typography>{path.label}</Typography>
      } 

      return <Link key={index} component={RouterLink} to={path.link} variant="caption"  sx={{ textDecoration:"none"}} fontSize={"1em"} >
                            {path.label}
      
              </Link>

    })


    return(
        <>
        <Box sx={{ display: 'flex', padding:0 }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          
          <List component="nav">
          
          <Link sx={{textDecoration:"none", color:"grey"}}  component={RouterLink} to="/">
              <ListItemButton>
                <ListItemIcon>
                    <HomeRepairService />
                </ListItemIcon>
                <ListItemText   primary="Dash" />
              </ListItemButton>
            </Link>


          <Link sx={{textDecoration:"none", color:"grey"}}  component={RouterLink} to="/services">
              <ListItemButton>
                <ListItemIcon>
                    <HomeRepairService />
                </ListItemIcon>
                <ListItemText   primary="Services" />
              </ListItemButton>
            </Link>

            

          <Link sx={{textDecoration:"none", color:"grey"}}  component={RouterLink} to="/internet-packages">
              <ListItemButton>
                <ListItemIcon>
                    <Inventory2 />
                </ListItemIcon>
                <ListItemText   primary="Internet Packages" />
              </ListItemButton>
            </Link>

          <Link sx={{textDecoration:"none", color:"grey"}} component={RouterLink} to="/ranchs">
              <ListItemButton>
                <ListItemIcon>
                    <LocationOn />
                </ListItemIcon>
                <ListItemText primary="Ranchs" />
              </ListItemButton>
          </Link>


              
            

          </List>
        
        
        
        </Drawer>
        
        
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            // maxWidth:"200px",
            boxSizing:"border-box",
            overflow: 'auto',
          }}
        >
          <Toolbar />
          {/* <Container  sx={{ mt: 8, mb: 4 }}> */}
            <Grid container  sx={ { padding:"2em 3em" }} spacing={2}>
                
                <Grid item xs={12}>
                  <Breadcrumbs maxItems={5} aria-label="breadcrumb">
                      {breadcrumbslinks}
                  </Breadcrumbs>
                </Grid>
                
                <Grid item xs={12}>
                  
                      <Outlet/>
                  
                </Grid>
                
            </Grid>
            
          {/* </Container> */}
        </Box>
      </Box>
    </>
    )
}








