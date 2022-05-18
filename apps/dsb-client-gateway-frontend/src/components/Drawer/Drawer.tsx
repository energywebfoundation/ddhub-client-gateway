import React from 'react';
import { Box, Divider, List, Typography } from '@mui/material';
import {
  Command,
  Database,
  Disc,
  GitMerge,
  Home,
  Layers,
  Settings,
} from 'react-feather';
import { routerConst } from '@dsb-client-gateway/ui/utils';
import { useStyles } from './Drawer.styles';
import { CollapsableMenu } from './CollapsableMenu/CollapsableMenu';
import { MenuItem } from './MenuItem/MenuItem';

export const Drawer = () => {
  const { classes } = useStyles();

  return (
    <div>
      <Box className={classes.logoWrapper}>
        <img src="/ew-main-logo.svg" alt="logo" className={classes.logo} />
        <Disc className={classes.disc} size={18} />
      </Box>
      <List>
        <MenuItem
          href={routerConst.Dashboard}
          title="Dashboard"
          icon={<Home className={classes.icon} size={20} />}
        />
        <Divider classes={{ root: classes.dividerColor }} />
      </List>

      <Typography classes={{ root: classes.menuTitle }} variant="body2">
        Admin
      </Typography>
      <List>
        <MenuItem
          href={routerConst.GatewaySettings}
          title="Gateway Settings"
          icon={<Settings className={classes.icon} size={18} />}
        />

        <MenuItem
          href={routerConst.AppsAndTopics}
          title="Topic management"
          icon={<Layers className={classes.icon} size={16} />}
        />

        <CollapsableMenu
          menuTitle="Channels"
          subMenu={[
            { title: 'My apps and topics', href: routerConst.ChannelApps },
            { title: 'Channel management', href: routerConst.ChannelsManagement },
          ]}
          menuIcon={<Command className={classes.icon} size={18} />}
        />

        <Divider classes={{ root: classes.dividerColor }} />
      </List>

      <Typography classes={{ root: classes.menuTitle }} variant="body2">
        Messaging
      </Typography>
      <List>
        <MenuItem
          href={routerConst.IntegrationAPIs}
          title="Integration APIs"
          icon={<GitMerge className={classes.icon} size={18} />}
        />

        <CollapsableMenu
          menuTitle="Large Data Messaging"
          subMenu={[
            {
              title: 'File upload',
              href: routerConst.LargeDataMessagingFileUpload,
            },
            {
              title: 'File download',
              href: routerConst.LargeDataMessagingFileDownload,
            },
          ]}
          menuIcon={<Database className={classes.icon} size={18} />}
        />

        <CollapsableMenu
          menuTitle="Data Messaging"
          subMenu={[
            { title: 'File upload', href: routerConst.DataMessagingFileUpload },
            {
              title: 'File download',
              href: routerConst.DataMessagingFileDownload,
            },
          ]}
          menuIcon={<Database className={classes.icon} size={18} />}
        />
      </List>
    </div>
  );
};
