import { makeStyles } from 'tss-react/mui';

const drawerWidth = 264;

export const useStyles = makeStyles()(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'unset',
    boxShadow: 'unset',
    padding: '5px 0'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  drawerPaper: {
    width: drawerWidth,
    padding: "15px"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  closeMenuButton: {
    marginRight: "auto",
    marginLeft: 0
  },
  navLink: {
    fontSize: '1.04rem',
    height: '42px',
    '&:hover': {
      background: 'none',
      transform: 'translateX(5px)'
    }
  },
  active: {
    color: "#ffffff",
    background: theme.palette.primary.main,
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.primary.main,
      transform: 'none'
    }
  },
  icon: {
    marginRight: "15px"
  },

  ListItemText: {
    lineHeight: '1.25'
  },

  logo: {
    height: '38px'
  },

  dividerColor: {
    backgroundColor: "rgb(255 255 255 / 20%)",
    margin: "15px 0px"
  },

  menuTitle: {
    marginLeft: "20px",
    marginBottom: "10px",
    fontSize: "14px",
    color: theme.palette.primary.main
  }

}));
