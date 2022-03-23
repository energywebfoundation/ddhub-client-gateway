import React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { makeStyles } from 'tss-react/mui';
import Link from 'next/link'
import clsx from 'clsx'
import { Home, Box as BoxIcon, File, FileText, Layers, MessageSquare, Mail, GitMerge } from 'react-feather'
import { useRouter } from 'next/router'
import { Divider } from '@mui/material';
const drawerWidth = 264;

const useStyles = makeStyles()(theme => ({
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

function Sidebar() {
    const { classes, theme } = useStyles();
    const isActive = (pathname: string) => (router.pathname === pathname ? classes.active : '')

    const router = useRouter()

    const [mobileOpen, setMobileOpen] = React.useState(false);
    function handleDrawerToggle() {
        setMobileOpen(!mobileOpen);
    }

    const drawer = (
        <div>
            <List>
                <Link href="#" passHref >
                    <ListItem button className={clsx(classes.navLink, isActive('#'))} component="a">
                        <Home className={classes.icon} size={20} />
                        <ListItemText>Dashboard</ListItemText>
                    </ListItem>
                </Link>
                <Divider classes={{ root: classes.dividerColor }} />
            </List>

            <Typography classes={{ root: classes.menuTitle }}>Admin</Typography>
            <List>
                <Link href="/" passHref >
                    <ListItem button className={clsx(classes.navLink, isActive('/'))} component="a">
                        <BoxIcon className={classes.icon} size={20} />
                        <ListItemText>Gateway Settings</ListItemText>
                    </ListItem>
                </Link>

                <Link href="/applications" passHref>
                    <ListItem button className={clsx(classes.navLink, isActive('/applications'))} component="a">
                        <Layers className={classes.icon} size={20} />
                        <ListItemText>Apps and Topics</ListItemText>
                    </ListItem>
                </Link>

                <Link href="#" passHref>
                    <ListItem button className={clsx(classes.navLink, isActive('#'))} component="a">
                        <FileText className={classes.icon} size={20} />
                        <ListItemText>Channels</ListItemText>
                    </ListItem>
                </Link>

                <Divider classes={{ root: classes.dividerColor }} />
            </List>

            <Typography classes={{ root: classes.menuTitle }}>Messaging</Typography>
            <List>
                <Link href="/docs" passHref >
                    <ListItem button className={clsx(classes.navLink, isActive('/docs'))} component="a">
                        <GitMerge className={classes.icon} size={20} />
                        <ListItemText>Integration APIs</ListItemText>
                    </ListItem>
                </Link>

                <Link href="/files" passHref >
                    <ListItem button className={clsx(classes.navLink, isActive('/files'))} component="a">
                        <MessageSquare className={classes.icon} size={20} />
                        <ListItemText>Data Messaging</ListItemText>
                    </ListItem>
                </Link>

                <Link href="#" passHref>
                    <ListItem button className={clsx(classes.navLink, isActive('#'))} component="a">
                        <Mail className={classes.icon} size={20} />
                        <ListItemText>Large Data Messaging</ListItemText>
                    </ListItem>
                </Link>

            </List>
        </div>
    );
    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img src="ew-flex-logo.png" alt="logo" className={classes.logo} />
                </Toolbar>
            </AppBar>

            <nav className={classes.drawer}>
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === "rtl" ? "right" : "left"}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        <IconButton
                            onClick={handleDrawerToggle}
                            className={classes.closeMenuButton}
                        >
                            <CloseIcon />
                        </IconButton>
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper
                        }}
                    >
                        <Box sx={theme.mixins.toolbar} />
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <div className={classes.content}>
                <Box sx={theme.mixins.toolbar} />
                {/* <VisibleItemList /> */}
            </div>
        </div>
    );
}
Sidebar.propTypes = {
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object
};
export default Sidebar;
