import { Collapse, List, ListItem } from '@mui/material';
import { ChevronRight, Circle } from 'react-feather';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useStyles } from '../Drawer.styles';
import { useCollapsableListItemEffects } from './CollapsableMenu.effects';
import { MenuItem } from '../MenuItem/MenuItem';
import { MenuItemText } from '../MenuItemText/MenuItemText';
import { useRouter } from 'next/router';

export interface SubMenuProps {
  href?: string;
  onClick?: () => void;
  title: string;
  menuIcon?: React.ReactNode;
}

export interface CollapsableListItemProps {
  menuTitle: string;
  menuIcon: React.ReactNode;
  subMenu: SubMenuProps[];
}

/**
 * CollapsableMenu is forced open or closed when the user navigates to or from a route that is a child of the menu.
 */
export const CollapsableMenu = ({
  menuTitle,
  subMenu,
  menuIcon,
}: CollapsableListItemProps) => {
  const router = useRouter();
  const { classes } = useStyles();
  const [hasActiveRoute, setHasActiveRoute] = React.useState(false);
  const { isOpen, handleOpening } = useCollapsableListItemEffects();

  const updateActiveRoute = () => {
    setHasActiveRoute(
      !!subMenu.find((item) => router.pathname.startsWith(item.href))
    );
  };

  useEffect(() => {
    updateActiveRoute();
  });

  useEffect(() => {
    updateActiveRoute();
  }, [router.pathname]);

  useEffect(() => {
    handleOpening(hasActiveRoute);
  }, [hasActiveRoute]);

  return (
    <>
      {subMenu.length > 0 && (
        <ListItem className={classes.navLink} onClick={() => handleOpening()}>
          {menuIcon}
          <MenuItemText title={menuTitle} />
          <ChevronRight
            size={16}
            className={clsx(classes.menuIcon, {
              [classes.menuIconActive]: isOpen,
            })}
          />
        </ListItem>
      )}

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subMenu.map((item) => {
            return (
              <MenuItem
                key={item.href ?? item.title.toLowerCase().replace(/ /g, '-')}
                href={item.href}
                title={item.title}
                onClick={item.onClick}
                icon={
                  item.menuIcon ?? (
                    <Circle className={classes.subMenuIcon} size={10} />
                  )
                }
              />
            );
          })}
        </List>
      </Collapse>
    </>
  );
};
