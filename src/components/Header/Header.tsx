import React from 'react';
import Image from 'next/image';
import { makeStyles } from '@material-ui/styles'
import {
  AppBar,
  Toolbar,
  Typography,
  Theme
} from '@material-ui/core';
import logo from '../../../public/ew-flex-single-logo.png';

export default function Header() {
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div>
              <Image src={logo} alt="EW logo" height={40} width={40} />
              <Typography className={classes.logoText} variant="h6">
                energy web
              </Typography>
            </div>

            <div>
              <Typography>
                  EW-DSB Client Gateway
              </Typography>
              <Typography className={classes.version} variant="caption">
                V 0.0.1
              </Typography>
            </div>
          </Toolbar>
        </AppBar>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
      background: '#000',
      '& *': {
        color: '#fff'
      },
      marginBottom: '3rem'
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
  
      '& > div': {
        display: 'flex',
        alignItems: 'center'
      }
    },
    logoText: {
      marginLeft: '1rem',
      fontFamily: 'Rajdhani'
    },
    version: {
      borderRadius: '1rem',
      marginLeft: '1rem',
      padding: '.3rem .8rem',
      color: '#fff',
      fontSize: '.7rem',
      background: theme.palette.secondary.main
    }
}))
  
