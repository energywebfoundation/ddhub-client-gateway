import { makeStyles } from 'tss-react/mui';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

export const useStyles = makeStyles()((theme) => ({
  form: {
    display: 'flex',
    height: '100%',
  },
  formContent: {
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
    '&.MuiGrid-item': {
      paddingTop: 11,
      paddingBottom: 40,
    },
  },
  divider: {
    backgroundColor: alpha(theme.palette.grey[600], 0.35),
    margin: '33px 15px 9px 0',
  },
  switchWrapper: {
    marginRight: '15px',
    marginTop: '20px',
  },
  switchBox: {
    backgroundColor: '#262B3F',
    borderRadius: '5px',
    padding: '5px 2px 5px 10px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
  },
  switchLabel: {
    justifyContent: 'space-between',
    marginLeft: 0,
    width: '100%',
    '>.MuiFormControlLabel-label': {
      fontFamily: theme.typography.body2.fontFamily,
      fontSize: 12,
      lineHeight: '21px',
      fontWeight: 405,
      color: theme.palette.text.secondary,
    },
  },
  switchDesc: {
    fontFamily: theme.typography.body2.fontFamily,
    fontSize: 10,
    lineHeight: 'normal',
    fontWeight: 405,
    color: theme.palette.grey[300],
    padding: '5px 10px',
  },
}));

export const CheckSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    backgroundColor: '#373C4D',
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&.Mui-checked': {
      backgroundColor: theme.palette.primary.main,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 14 14"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M8.90964 8.09166C9.14297 8.325 9.14297 8.675 8.90964 8.90833C8.79297 9.025 8.6763 9.08333 8.5013 9.08333C8.3263 9.08333 8.20964 9.025 8.09297 8.90833L5.0013 5.81666L1.90964 8.90833C1.79297 9.025 1.6763 9.08333 1.5013 9.08333C1.3263 9.08333 1.20964 9.025 1.09297 8.90833C0.859635 8.675 0.859635 8.325 1.09297 8.09166L4.18464 5L1.09297 1.90833C0.859635 1.675 0.859635 1.325 1.09297 1.09166C1.3263 0.858331 1.6763 0.858331 1.90964 1.09166L5.0013 4.18333L8.09297 1.09166C8.3263 0.858331 8.6763 0.858331 8.90964 1.09166C9.14297 1.325 9.14297 1.675 8.90964 1.90833L5.81797 5L8.90964 8.09166Z"/></svg>')`,
      right: 10,
      marginTop: 2,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));
