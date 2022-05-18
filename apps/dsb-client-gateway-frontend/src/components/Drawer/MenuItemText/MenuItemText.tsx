import { ListItemText, Typography } from '@mui/material';
import React from 'react';
import { useStyles } from './MenuItemText.styles';

export interface MenuItemTextProps {
  title: string;
}

export const MenuItemText = ({ title }: MenuItemTextProps) => {
  const { classes } = useStyles();
  return (
    <ListItemText>
      <Typography variant="body1" className={classes.listItemText}>
        {title}
      </Typography>
    </ListItemText>
  );
};
