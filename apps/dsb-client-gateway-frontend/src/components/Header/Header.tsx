import Image from 'next/image'
import Link from 'next/link'
import { makeStyles } from 'tss-react/mui';
import { AppBar, Toolbar, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import logo from '../../../public/ew-flex-single-logo.png'

export default function Header() {
  const { classes } = useStyles()
  const router = useRouter()

  const isActive = (pathname: string) => (router.pathname === pathname ? classes.active : '')

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
          <div className={classes.nav}>
            <Link href="/">
              <a className={clsx(classes.navLink, isActive('/'))}>Admin</a>
            </Link>
            <Link href="/files">
              <a className={clsx(classes.navLink, isActive('/files'))}>Files</a>
            </Link>
            <Link href="/docs">
              <a className={clsx(classes.navLink, isActive('/docs'))}>Docs</a>
            </Link>
            <Link href="/applications">
              <a className={clsx(classes.navLink, isActive('/applications'))}>Applications</a>
            </Link>
          </div>
          <p className={classes.divider}>•</p>
          <Typography>EW-DSB Client Gateway</Typography>
          <Typography className={classes.version} variant="caption">
            v0.5.4
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  )
}

const useStyles = makeStyles()((theme) => ({
  appBar: {
    background: '#000',
    '& *': {
      color: '#fff'
    },
    marginBottom: '3rem'
  },
  active: {
    color: theme.palette.secondary.main
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
  },
  divider: {
    margin: '0 1rem'
  },
  nav: {
    display: 'flex',
    width: '30rem',
    justifyContent: 'space-between'
  },
  navLink: {
    fontSize: '1rem',

    '&:hover': {
      textDecorationLine: 'underline',
      color: theme.palette.secondary.main
    }
  }
}))
