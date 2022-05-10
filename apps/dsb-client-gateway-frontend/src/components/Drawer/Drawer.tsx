import React from 'react';
import {
  Typography,
  ListItemText,
  ListItem,
  List,
  Box,
  Divider,
  Collapse,
} from '@mui/material';
import Link from 'next/link';
import clsx from 'clsx';
import {
  ChevronRight,
  Home,
  Layers,
  GitMerge,
  Settings,
  Command,
  Database,
  Disc,
  Circle,
} from 'react-feather';
import { routerConst } from '@dsb-client-gateway/ui/utils';
import { useDrawerEffects } from './Drawer.effects';
import { useStyles } from './Drawer.styles';

export const Drawer = () => {
  const { classes } = useStyles();
  const {
    isActive,
    dataOpen,
    largeDataOpen,
    handleDataOpen,
    handleLargeDataOpen,
  } = useDrawerEffects();

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

        <ListItem button className={classes.navLink} onClick={handleDataOpen}>
          <Database className={classes.icon} size={18} />
          <ListItemText>
            <Typography variant="body1" className={classes.listItemText}>
              Data Messaging
            </Typography>
          </ListItemText>
          <ChevronRight
            size={16}
            className={clsx(classes.menuIcon, {
              [classes.menuIconActive]: dataOpen,
            })}
          />
        </ListItem>
        <Collapse in={dataOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href={routerConst.DataMessagingFileUpload} passHref>
              <ListItem
                className={clsx(
                  classes.navLink,
                  isActive(routerConst.DataMessagingFileUpload)
                )}
                component="a"
              >
                <Circle className={classes.subMenuIcon} size={10} />
                <ListItemText>
                  <Typography variant="body1" className={classes.listItemText}>
                    File upload
                  </Typography>
                </ListItemText>
              </ListItem>
            </Link>
            <Link href={routerConst.DataMessagingFileDownload} passHref>
              <ListItem
                className={clsx(
                  classes.navLink,
                  isActive(routerConst.DataMessagingFileDownload)
                )}
                component="a"
              >
                <Circle className={classes.subMenuIcon} size={10} />
                <ListItemText>
                  <Typography variant="body1" className={classes.listItemText}>
                    File download
                  </Typography>
                </ListItemText>
              </ListItem>
            </Link>
          </List>
        </Collapse>

        <ListItem
          button
          className={classes.navLink}
          onClick={handleLargeDataOpen}
        >
          <Database className={classes.icon} size={18} />
          <ListItemText>
            <Typography variant="body1" className={classes.listItemText}>
              Large Data Messaging
            </Typography>
          </ListItemText>
          <ChevronRight
            size={16}
            className={clsx(classes.menuIcon, {
              [classes.menuIconActive]: largeDataOpen,
            })}
          />
        </ListItem>
        <Collapse in={largeDataOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href={routerConst.LargeDataMessagingFileUpload} passHref>
              <ListItem
                className={clsx(
                  classes.navLink,
                  isActive(routerConst.LargeDataMessagingFileUpload)
                )}
                component="a"
              >
                <Circle className={classes.subMenuIcon} size={10} />
                <ListItemText>
                  <Typography variant="body1" className={classes.listItemText}>
                    File upload
                  </Typography>
                </ListItemText>
              </ListItem>
            </Link>
            <Link href={routerConst.LargeDataMessagingFileDownload} passHref>
              <ListItem
                className={clsx(
                  classes.navLink,
                  isActive(routerConst.LargeDataMessagingFileDownload)
                )}
                component="a"
              >
                <Circle className={classes.subMenuIcon} size={10} />
                <ListItemText>
                  <Typography variant="body1" className={classes.listItemText}>
                    File download
                  </Typography>
                </ListItemText>
              </ListItem>
            </Link>
          </List>
        </Collapse>
      </List>
    </div>
  );
};
