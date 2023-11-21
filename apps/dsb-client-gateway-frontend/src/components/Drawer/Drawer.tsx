import React from 'react';
import { Box, Divider, List, Typography } from '@mui/material';
import {
  Command,
  Database,
  GitMerge,
  Home,
  Layers,
  Settings,
  Inbox,
  Edit3,
} from 'react-feather';
import {
  ClientSubscriptionIcon,
  AddressBookIcon,
} from '@ddhub-client-gateway-frontend/ui/core';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import { useStyles } from './Drawer.styles';
import {
  CollapsableListItemProps,
  CollapsableMenu,
} from './CollapsableMenu/CollapsableMenu';
import { MenuItem, MenuItemProps } from './MenuItem/MenuItem';
import { useUserDataEffects } from '@ddhub-client-gateway-frontend/ui/login';
import {
  NewMessage,
  useNewMessageEffects,
} from '@ddhub-client-gateway-frontend/ui/messaging';

export const Drawer = () => {
  const {
    userData: { displayedRoutes },
  } = useUserDataEffects();
  const { classes } = useStyles();
  const { openNewMessageModal } = useNewMessageEffects();

  const administrationRoutes: (MenuItemProps | CollapsableListItemProps)[] = [
    {
      href: routerConst.GatewaySettings,
      title: 'Gateway Settings',
      icon: <Settings className={classes.icon} size={18} />,
    },
    {
      href: routerConst.AddressBook,
      title: 'Address Book',
      icon: (
        <Box className={classes.clientIcon}>
          <AddressBookIcon />
        </Box>
      ),
    },
    {
      href: routerConst.TopicManagement,
      title: 'Topic Management',
      icon: <Layers className={classes.icon} size={16} />,
    },
    {
      menuTitle: 'Channels',
      subMenu: [
        {
          href: routerConst.ChannelApps,
          title: 'My Apps and Topics',
        },
        {
          href: routerConst.ChannelsManagement,
          title: 'Channel Management',
        },
      ],
      menuIcon: <Command className={classes.icon} size={18} />,
    },
  ];

  const messagingRoutes: (MenuItemProps | CollapsableListItemProps)[] = [
    {
      href: routerConst.IntegrationAPIs,
      title: 'Integration APIs',
      icon: <GitMerge className={classes.icon} size={18} />,
    },
    {
      href: routerConst.ClientIds,
      title: 'Client Subscriptions',
      icon: (
        <Box className={classes.clientIcon}>
          <ClientSubscriptionIcon />
        </Box>
      ),
    },
    {
      menuTitle: 'Data Messaging',
      subMenu: [
        {
          href: routerConst.DataMessagingFileUpload,
          title: 'File Upload',
        },
        {
          href: routerConst.DataMessagingFileDownload,
          title: 'File Download',
        },
      ],
      menuIcon: <Database className={classes.icon} size={18} />,
    },
    {
      menuTitle: 'Large Data Messaging',
      subMenu: [
        {
          href: routerConst.LargeDataMessagingFileUpload,
          title: 'File Upload',
        },
        {
          href: routerConst.LargeDataMessagingFileDownload,
          title: 'File Download',
        },
      ],
      menuIcon: <Database className={classes.icon} size={18} />,
    },
    {
      menuTitle: 'Message Box',
      subMenu: [
        {
          title: 'New Message',
          onClick: openNewMessageModal,
          menuIcon: <Edit3 style={{ margin: '0 10px 0 2px' }} size={16} />,
        },
        {
          href: routerConst.MessageInbox,
          title: 'My Messages',
        },
        {
          href: routerConst.MessageOutbox,
          title: 'Sent Messages',
        },
      ],
      menuIcon: <Inbox className={classes.icon} size={18} />,
    },
  ];

  const isMenuItemProps = (
    item: MenuItemProps | CollapsableListItemProps
  ): item is MenuItemProps => {
    return !!item && 'href' in item;
  };

  const renderMenuList = (
    routes: (MenuItemProps | CollapsableListItemProps)[]
  ) => {
    return routes.map((route) => {
      if (isMenuItemProps(route)) {
        return (
          displayedRoutes.has(route.href) && (
            <MenuItem key={route.title} {...route} />
          )
        );
      } else {
        return (
          route.subMenu
            .map((submenuItem) => submenuItem.href)
            .some((href) => displayedRoutes.has(href)) && (
            <CollapsableMenu key={route.menuTitle} {...route} />
          )
        );
      }
    });
  };

  const routeListHasDisplayedRoutes = (
    routes: (MenuItemProps | CollapsableListItemProps)[]
  ) => {
    return routes.some((route) => {
      if (isMenuItemProps(route)) {
        return displayedRoutes.has(route.href);
      } else {
        return route.subMenu.some((subMenu) =>
          displayedRoutes.has(subMenu.href)
        );
      }
    });
  };

  return (
    <div>
      <Box className={classes.logoWrapper}>
        <img src="/ew-main-logo.svg" alt="logo" className={classes.logo} />
      </Box>
      <List>
        <MenuItem
          href={routerConst.Dashboard}
          title="Dashboard"
          icon={<Home className={classes.icon} size={20} />}
        />
      </List>

      {routeListHasDisplayedRoutes(administrationRoutes) && (
        <>
          <Divider classes={{ root: classes.dividerColor }} />
          <Typography classes={{ root: classes.menuTitle }} variant="body2">
            Admin
          </Typography>
          <List>{renderMenuList(administrationRoutes)}</List>
        </>
      )}

      {routeListHasDisplayedRoutes(messagingRoutes) && (
        <>
          <Divider classes={{ root: classes.dividerColor }} />
          <Typography classes={{ root: classes.menuTitle }} variant="body2">
            Messaging
          </Typography>
          <List>{renderMenuList(messagingRoutes)}</List>
        </>
      )}

      <NewMessage />
    </div>
  );
};
