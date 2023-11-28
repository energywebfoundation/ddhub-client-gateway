import {makeStyles} from "tss-react/mui";
import {alpha} from "@mui/material/styles";

export const useStyles = makeStyles()((theme) => ({
  footerDiv: {
    textAlign: 'center',
    paddingBottom: 17,
    paddingTop: 17,
    placeSelf: 'center'
  },
  logoWrapper: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 7
  },
  logo: {
    width: 102,
    height: 29
  },
  label: {
    fontSize: 12,
    lineHeight: '21px',
    color: alpha(theme.palette.text.primary, 0.7),
  },
  version: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: '21px',
    color: '#9CA1AA',
    alignSelf: 'center',
  },
}));
