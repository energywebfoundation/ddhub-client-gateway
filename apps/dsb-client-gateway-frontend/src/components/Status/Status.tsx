import React from 'react';
import { useStyles } from './Status.styles';

export enum StatusTypeEnum {
  Up = 'up',
  Down = 'down'
}

export interface StatusProps {
  type: StatusTypeEnum;
  text: string;
}

export function Status(props: StatusProps) {
  const {classes} = useStyles();
  const isSuccess = props.type === StatusTypeEnum.Up;
  const styles = `${classes.status} ${isSuccess ? classes.success : classes.failure}`;
  return (
    <span className={styles}>{props.text}</span>
  );
}

export default Status;
