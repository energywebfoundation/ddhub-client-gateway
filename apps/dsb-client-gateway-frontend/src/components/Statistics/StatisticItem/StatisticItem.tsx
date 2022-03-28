import { Avatar, Typography } from '@mui/material';
import { Box as BoxIcon } from 'react-feather';
import React from 'react';
import { useStyles } from './StatisticItem.styles';
import { alpha } from '@mui/material/styles';

export interface StatisticItemProps {
  color: string;
  number: string;
  title: string;
}

export function StatisticItem(props: StatisticItemProps) {
  const {classes} = useStyles();
  return (
    <div className={classes.item}>
      <Avatar style={{backgroundColor: alpha(props.color, 0.12)}}>
        <BoxIcon style={{stroke: props.color}} size={20}/>
      </Avatar>
      <div className={classes.itemText}><Typography>{props.number}</Typography> {props.title}</div>
    </div>
  );
}

export default StatisticItem;
