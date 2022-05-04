import React from 'react';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import {
  Toolbar,
  IconButton,
  Hidden,
  Drawer as MuiDrawer,
  AppBar,
} from '@mui/material';
import { Drawer } from '../Drawer';
import { useSidebarEffects } from './Sidebar.effects';
import { useStyles } from './Sidebar.styles';

function Sidebar() {
  const { classes, theme } = useStyles();
  const { handleDrawerToggle, mobileOpen } = useSidebarEffects();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <MuiDrawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              className={classes.closeMenuButton}
            >
              <CloseIcon />
            </IconButton>
            <Drawer />
          </MuiDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <MuiDrawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <Drawer />
          </MuiDrawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default Sidebar;
