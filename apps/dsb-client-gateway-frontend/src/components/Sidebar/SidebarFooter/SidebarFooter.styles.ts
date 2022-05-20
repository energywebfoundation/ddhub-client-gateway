import {makeStyles} from "tss-react/mui";
import {alpha} from "@mui/material/styles";

export const useStyles = makeStyles()((theme) => ({
  footerDiv: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    paddingBottom: 17,
    paddingTop: 17,
    placeSelf: "center"
  },
  footerRow: {
    display: "flex",
    alignItems: 'center'
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
    width: 30,
    height: 30
  },
  logoText: {
    height: 13,
    marginTop: 2
  },
  label: {
    fontSize: 12,
    color: alpha(theme.palette.text.primary, 0.7)
  }
}));
