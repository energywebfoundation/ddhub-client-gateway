import Link from 'next/link';
import { ListItem } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { useStyles } from '../Drawer.styles';
import { useMenuItemEffects } from './MenuItem.effects';
import { MenuItemText } from '../MenuItemText/MenuItemText';

export interface MenuItemProps {
  href: string;
  title: string;
  icon: React.ReactNode;
}

export const MenuItem = ({ href, title, icon }: MenuItemProps) => {
  const { isActive } = useMenuItemEffects();
  const { classes } = useStyles();

  return (
    <Link href={href} passHref>
      <ListItem className={clsx(classes.navLink, isActive(href))} component="a">
        {icon}
        <MenuItemText title={title} />
      </ListItem>
    </Link>
  );
};
