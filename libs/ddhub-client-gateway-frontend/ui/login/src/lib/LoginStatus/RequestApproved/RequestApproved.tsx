import { Typography, Stack } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Check } from 'react-feather';

export const RequestApproved = () => {
  const { classes } = useStyles();
  return (
    <Stack spacing={1} alignItems="center" direction="row" mt={4}>
      <Check className={classes.icon} size={22} />
      <Typography className={classes.label}>
        Enrolment request approved
      </Typography>
    </Stack>
  );
};

export default RequestApproved;

export const useStyles = makeStyles()((theme) => ({
  label: {
    fontFamily: theme.typography.body2.fontFamily,
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '21px',
    color: theme.palette.common.white,
  },
  icon: {
    color: theme.palette.success.main,
  },
}));
