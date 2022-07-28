import React from 'react';
import { useStyles } from './Status.styles';

export enum StatusTypeEnum {
  Success = 'SUCCESS',
  Failure = 'FAILURE',
}

export interface StatusProps {
  type: StatusTypeEnum;
  text: string;
}

// TODO: check if this component is redundant now that we have extended Badge component
export function Status({ type }: StatusProps) {
  const { classes } = useStyles();
  const isSuccess = type === StatusTypeEnum.Success;
  const styles = `${classes.status} ${
    isSuccess ? classes.success : classes.failure
  }`;
  return <span className={styles}></span>;
}

export default Status;
