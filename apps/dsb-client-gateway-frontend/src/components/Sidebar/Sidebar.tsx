import React from 'react';
import { Box, Drawer as MuiDrawer } from '@mui/material';
import { Drawer } from '../Drawer';
import SidebarFooter from './SidebarFooter/SidebarFooter';
import { useStyles } from './Sidebar.styles';

function Sidebar() {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <MuiDrawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Drawer />
          <Box flexGrow={1}></Box>
          <SidebarFooter />
        </MuiDrawer>
      </nav>
    </div>
  );
}

export default Sidebar;
