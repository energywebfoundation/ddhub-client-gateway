import { FC } from 'react';
import { range } from 'lodash';
import { Box, Skeleton } from '@mui/material';
import { useStyles } from './TableRowsLoadingComponent.styles';

export const TableRowsLoadingComponent: FC<{ pageSize: number }> = ({
  pageSize,
}) => {
  const { classes } = useStyles();
  return (
    <>
      <Box className={classes.progress}></Box>
      {range(pageSize).map((value) => (
        <Box key={value.toString()}>
          <Box m={'10px'}>
            <Skeleton className={classes.skeleton} />
          </Box>
        </Box>
      ))}
    </>
  );
};
