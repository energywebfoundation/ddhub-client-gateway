import { TableCell, TableRow } from '@mui/material';
import React from 'react';

export interface EmptyRowProps {
  rowsToFill: number;
}

export const EmptyRow = ({rowsToFill}: EmptyRowProps) => {
  return (<TableRow style={{height: 53 * rowsToFill}}>
    <TableCell colSpan={6}/>
  </TableRow>);
};
