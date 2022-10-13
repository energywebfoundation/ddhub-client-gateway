import { Box, Grid, Typography } from '@mui/material';
import { useStyles } from './ApplicationItem.styles';

interface ApplicationListProps {
  label: string;
  value: string;
  topicsCount: number;
}

export interface ApplicationItemProps {
  option: ApplicationListProps;
  listProps: any;
}

export const ApplicationItem = ({ listProps, option }: ApplicationItemProps) => {
  const { classes } = useStyles();

  return (
    <div key={listProps.key}>
      { listProps['data-option-index'] === 0 && (
        <Typography className={classes.select}>
          Select
        </Typography>
      )}
      <Box component="li" {...listProps}>
        <Grid container justifyContent="space-between" wrap="nowrap">
          <Grid item sx={{ width: '100%', maxWidth: 150 }}>
            <Typography noWrap className={classes.name}>
              {option.label}
            </Typography>
          </Grid>
          <Grid item justifySelf="flex-end">
            <Typography noWrap className={classes.count}>
              {option.topicsCount} Topics
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
