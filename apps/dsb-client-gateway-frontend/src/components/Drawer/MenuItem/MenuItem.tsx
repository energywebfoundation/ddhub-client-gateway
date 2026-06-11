import Link from 'next/link';
import { ListItem } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { useStyles } from '../Drawer.styles';
import { useMenuItemEffects } from './MenuItem.effects';
import { MenuItemText } from '../MenuItemText/MenuItemText';

export interface MenuItemProps {
  href?: string;
  onClick?: () => void;
  title: string;
  icon: React.ReactNode;
}

export const MenuItem = ({ href, onClick, title, icon }: MenuItemProps) => {
  const { isActive } = useMenuItemEffects();
  const { classes } = useStyles();

  return href ? (
    <ListItem
      component={Link}
      href={href}
      className={clsx(classes.navLink, isActive(href))}
    >
      {icon}
      <MenuItemText title={title} />
    </ListItem>
  ) : (
    <ListItem className={classes.navLink} onClick={onClick}>
      {icon}
      <MenuItemText title={title} />
    </ListItem>
  );
};
