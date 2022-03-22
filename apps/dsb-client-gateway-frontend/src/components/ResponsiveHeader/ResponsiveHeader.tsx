import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Link from 'next/link'
import clsx from 'clsx'
import { Home, Box, File, FileText, Layers, MessageSquare, Mail, GitMerge } from 'react-feather'
import { useRouter } from 'next/router'
import { Divider } from "@material-ui/core";
const drawerWidth = 264;
const useStyles = makeStyles((theme) => ({
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
    toolbar: theme.mixins.toolbar,
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
    iconDashboard: {
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

    menuTitle:{
        marginLeft: "20px",
        marginBottom: "10px",
        fontSize: "14px",
        color: theme.palette.primary.main
    }

}));
function ResponsiveDrawer() {

    const isActive = (pathname: string) => (router.pathname === pathname ? classes.active : '')

    const dummyCategories = [
        "files",
        "docs",
        "applications"
    ];

    const classes = useStyles();
    const theme = useTheme();
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
                    <Home className={classes.iconDashboard} size={20} />
                    <ListItemText>Dashboard</ListItemText>
                </ListItem>
                </Link>
            <Divider classes={{root: classes.dividerColor}}/>
            </List>

            <Typography classes={{root: classes.menuTitle}}>Admin</Typography>
            <List>
                <Link href="/" passHref >
                <ListItem button className={clsx(classes.navLink, isActive('/'))} component="a">
                    <Box className={classes.iconDashboard} size={20} />
                    <ListItemText>Gateway Settings</ListItemText>
                </ListItem>
                </Link>

                <Link href="/applications" passHref>
                <ListItem button className={clsx(classes.navLink, isActive('/applications'))} component="a">
                    <Layers className={classes.iconDashboard} size={20} />
                    <ListItemText>Apps and Topics</ListItemText>
                </ListItem>
                </Link>

                <Link href="#" passHref>
                <ListItem button className={clsx(classes.navLink, isActive('#'))} component="a">
                    <FileText className={classes.iconDashboard} size={20} />
                    <ListItemText>Channels</ListItemText>
                </ListItem>
                </Link>
                
                <Divider classes={{root: classes.dividerColor}}/>
            </List>

            <Typography classes={{root: classes.menuTitle}}>Messaging</Typography>
            <List>
                <Link href="/docs" passHref >
                <ListItem button className={clsx(classes.navLink, isActive('/docs'))} component="a">
                    <GitMerge className={classes.iconDashboard} size={20} />
                    <ListItemText>Integration APIs</ListItemText>
                </ListItem>
                </Link>

                <Link href="/files" passHref >
                <ListItem button className={clsx(classes.navLink, isActive('/files'))} component="a">
                    <MessageSquare className={classes.iconDashboard} size={20} />
                    <ListItemText>Data Messaging</ListItemText>
                </ListItem>
                </Link>

                <Link href="#" passHref>
                <ListItem button className={clsx(classes.navLink, isActive('#'))} component="a">
                    <Mail className={classes.iconDashboard} size={20} />
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
                        <div className={classes.toolbar} />
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <div className={classes.content}>
                <div className={classes.toolbar} />
                {/* <VisibleItemList /> */}
            </div>
        </div>
    );
}
ResponsiveDrawer.propTypes = {
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object
};
export default ResponsiveDrawer;
