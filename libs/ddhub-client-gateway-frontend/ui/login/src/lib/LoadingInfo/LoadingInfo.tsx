import { CircularProgress, Stack } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export interface LoadingInfoProps {
  children: React.ReactNode;
  mt?: number;
}

export function LoadingInfo(props: LoadingInfoProps) {
  return (
    <Stack spacing={1} direction={'row'} mt={props?.mt ?? 0}>
      <CircularProgress color="primary" size={22} />
      <Stack>{props.children}</Stack>
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
