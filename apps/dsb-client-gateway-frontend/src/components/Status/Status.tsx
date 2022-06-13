import React from 'react';
import { useStyles } from './Status.styles';
import { capitalizeFirstLetter } from "@ddhub-client-gateway-frontend/ui/utils";

export enum StatusTypeEnum {
  Success = 'SUCCESS',
  Failure = 'FAILURE'
}

export interface StatusProps {
  type: StatusTypeEnum;
  text: string;
}

export function Status(props: StatusProps) {
  const {classes} = useStyles();
  const isSuccess = props.type === StatusTypeEnum.Success;
  const styles = `${classes.status} ${isSuccess ? classes.success : classes.failure}`;
  return (
    <span className={styles}>{capitalizeFirstLetter(props.text.toLowerCase())}</span>
  );
}

export default Status;
