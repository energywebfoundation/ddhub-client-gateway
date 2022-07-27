import { FC, memo } from 'react';
import { Typography, Box, BoxProps } from '@mui/material';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './RestrictionsViewBox.styles';

interface RestrictionsViewBoxProps {
  label: string;
  list: string[];
  formatter?: (value: string) => string;
  wrapperProps?: BoxProps;
  wrapperMaxHeight?: number;
  listMaxHeight?: number;
}

export const RestrictionsViewBox: FC<RestrictionsViewBoxProps> = memo(
  ({ label, list, formatter, wrapperProps, wrapperMaxHeight = 159, listMaxHeight = 119 }) => {
    const { classes } = useStyles();

    return (
      <Box {...wrapperProps} className={classes.wrapper} style={{maxHeight: wrapperMaxHeight}}>
        <Box mb={1}>
          <Typography variant="body2" className={classes.label}>
            {label}
          </Typography>
        </Box>
        <Box className={classes.list} style={{maxHeight: listMaxHeight}}>
          {list?.map((item) => {
            return (
              <Box key={item} display="flex" justifyContent="space-between" pl={2} pr={2} height={37}>
                <Typography noWrap variant="body2" className={classes.text}>
                  {formatter ? formatter(item) : item}
                </Typography>
                <CopyToClipboard
                  text={item}
                  wrapperProps={{ display: 'flex' }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }
);

RestrictionsViewBox.displayName = 'RestrictionsViewBox';
