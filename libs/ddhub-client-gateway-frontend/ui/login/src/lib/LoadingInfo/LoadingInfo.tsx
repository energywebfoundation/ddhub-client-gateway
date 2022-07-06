import { CircularProgress, Stack, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export interface LoadingInfoProps {
  children: React.ReactNode;
}

export function LoadingInfo(props: LoadingInfoProps) {
  const { classes } = useStyles();

  return (
    <Stack spacing={1} alignItems="top" direction={'row'} mt={4}>
      <CircularProgress color="primary" size={22} />
      {props.children}
    </Stack>
  );
}

export default LoadingInfo;

const useStyles = makeStyles()((theme) => ({
  label: {
    fontFamily: theme.typography.body2.fontFamily,
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '21px',
    color: theme.palette.common.white,
  },
}));
