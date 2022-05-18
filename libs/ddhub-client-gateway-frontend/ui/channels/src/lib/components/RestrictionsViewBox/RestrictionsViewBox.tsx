import { FC, memo } from 'react';
import { Typography, Box, BoxProps } from '@mui/material';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './RestrictionsViewBox.styles';

interface RestrictionsViewBoxProps {
  label: string;
  list: string[];
  formatter?: (value: string) => string;
  wrapperProps?: BoxProps;
}

export const RestrictionsViewBox: FC<RestrictionsViewBoxProps> = memo(
  ({ label, list, formatter, wrapperProps }) => {
    const { classes } = useStyles();

    return (
      <Box {...wrapperProps} className={classes.wrapper}>
        <Box mb={1}>
          <Typography variant="body2" className={classes.label}>
            {label}
          </Typography>
        </Box>
        <Box className={classes.list}>
          {list?.map((item) => {
            return (
              <Box key={item} mb={0.4} display="flex">
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
