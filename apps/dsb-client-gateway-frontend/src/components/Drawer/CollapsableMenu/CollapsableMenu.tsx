import { Collapse, List, ListItem } from '@mui/material';
import { ChevronRight, Circle } from 'react-feather';
import clsx from 'clsx';
import React from 'react';
import { useStyles } from '../Drawer.styles';
import { useCollapsableListItemEffects } from './CollapsableMenu.effects';
import { MenuItem } from '../MenuItem/MenuItem';
import { MenuItemText } from '../MenuItemText/MenuItemText';

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

export const CollapsableMenu = ({
  menuTitle,
  subMenu,
  menuIcon,
}: CollapsableListItemProps) => {
  const { classes } = useStyles();
  const { isOpen, handleOpening } = useCollapsableListItemEffects();
  return (
    <>
      {subMenu.length > 0 && (
        <ListItem className={classes.navLink} onClick={handleOpening}>
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
