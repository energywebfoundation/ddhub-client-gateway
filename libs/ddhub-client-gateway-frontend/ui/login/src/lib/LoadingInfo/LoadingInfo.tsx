import { CircularProgress, Stack, Typography } from '@mui/material';

export interface LoadingInfoProps {
  children: React.ReactNode;
}

export function LoadingInfo(props: LoadingInfoProps) {
  return (
    <Stack spacing={1} alignItems="center" direction={'row'}>
      <CircularProgress color="primary" size={22} />
      <Typography variant={'h6'}>{props.children}</Typography>
    </Stack>
  );
}

export default LoadingInfo;
