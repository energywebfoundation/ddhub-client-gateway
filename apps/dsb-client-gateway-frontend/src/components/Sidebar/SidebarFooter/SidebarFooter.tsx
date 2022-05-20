import {useStyles} from "./SidebarFooter.styles";
import React from "react";
import {Box, Typography} from "@mui/material";

function SidebarFooter() {
  const { classes } = useStyles();

  return (<div className={classes.footerDiv}>
    <div className={classes.footerRow}>
      <Typography variant="body2" className={classes.label}>Powered by</Typography>
      <Box className={classes.logoWrapper}>
        <img src="/ew-logo-white.svg" alt="logo" className={classes.logo} />
      </Box>
      <Box className={classes.logoWrapper}>
        <img src="/ew-logo-text.svg" alt="logo" className={classes.logoText} />
      </Box>
    </div>
  </div>);
}

export default SidebarFooter;
