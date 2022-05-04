import React from 'react';
import {
  Typography,
  ListItemText,
  ListItem,
  List,
  Box,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import clsx from 'clsx';
import {
  Home,
  Layers,
  GitMerge,
  Settings,
  Command,
  Database,
  Disc,
} from 'react-feather';
import { routerConst } from '@dsb-client-gateway/ui/utils';
import { useDrawerEffects } from './Drawer.effects';
import { useStyles } from './Drawer.styles';

export const Drawer = () => {
  const { classes } = useStyles();
  const { isActive } = useDrawerEffects();

  return (
    <div>
      <Box className={classes.logoWrapper}>
        <img src="/ew-main-logo.svg" alt="logo" className={classes.logo} />
        <Disc className={classes.disc} size={18} />
      </Box>
      <List>
        <Link href={routerConst.Dashboard} passHref>
          <ListItem
            button
            className={clsx(classes.navLink, isActive(routerConst.Dashboard))}
            component="a"
          >
            <Home className={classes.icon} size={20} />
            <ListItemText>
              <Typography variant="body1" className={classes.listItemText}>
                Dashboard
              </Typography>
            </ListItemText>
          </ListItem>
        </Link>
        <Divider classes={{ root: classes.dividerColor }} />
      </List>

      <Typography classes={{ root: classes.menuTitle }} variant="body2">
        Admin
      </Typography>
      <List>
        <Link href={routerConst.GatewaySettings} passHref>
          <ListItem
            button
            className={clsx(
              classes.navLink,
              isActive(routerConst.GatewaySettings)
            )}
            component="a"
          >
            <Settings className={classes.icon} size={18} />
            <ListItemText>
              <Typography variant="body1" className={classes.listItemText}>
                Gateway Settings
              </Typography>
            </ListItemText>
          </ListItem>
        </Link>

        <Link href={routerConst.AppsAndTopics} passHref>
          <ListItem
            button
            className={clsx(
              classes.navLink,
              isActive(routerConst.AppsAndTopics)
            )}
            component="a"
          >
            <Layers className={classes.icon} size={16} />
            <ListItemText>
              <Typography variant="body1" className={classes.listItemText}>
                Apps and Topics
              </Typography>
            </ListItemText>
          </ListItem>
        </Link>

        <Link href={routerConst.Channels} passHref>
          <ListItem
            button
            className={clsx(classes.navLink, isActive(routerConst.Channels))}
            component="a"
          >
            <Command className={classes.icon} size={18} />
            <ListItemText>
              <Typography variant="body1" className={classes.listItemText}>
                Channels
              </Typography>
            </ListItemText>
          </ListItem>
        </Link>

        <Divider classes={{ root: classes.dividerColor }} />
      </List>

      <Typography classes={{ root: classes.menuTitle }} variant="body2">
        Messaging
      </Typography>
      <List>
        <Link href={routerConst.IntegrationAPIs} passHref>
          <ListItem
            button
            className={clsx(
              classes.navLink,
              isActive(routerConst.IntegrationAPIs)
            )}
            component="a"
          >
            <GitMerge className={classes.icon} size={18} />
            <ListItemText>
              <Typography variant="body1" className={classes.listItemText}>
                Integration APIs
              </Typography>
            </ListItemText>
          </ListItem>
        </Link>

        <Link href="/files" passHref>
          <ListItem
            button
            className={clsx(classes.navLink, isActive('/files'))}
            component="a"
          >
            <Database className={classes.icon} size={18} />
            <ListItemText>
              <Typography variant="body1" className={classes.listItemText}>
                Data Messaging
              </Typography>
            </ListItemText>
          </ListItem>
        </Link>

        <Link href="#" passHref>
          <ListItem
            button
            className={clsx(classes.navLink, isActive('#'))}
            component="a"
          >
            <Database className={classes.icon} size={18} />
            <ListItemText>
              <Typography variant="body1" className={classes.listItemText}>
                Large Data Messaging
              </Typography>
            </ListItemText>
          </ListItem>
        </Link>
      </List>
    </div>
  );
};
