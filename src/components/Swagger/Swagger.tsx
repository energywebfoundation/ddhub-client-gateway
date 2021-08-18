import React from 'react'
import { makeStyles } from '@material-ui/styles'
import {
  Theme,
  Link,
  Typography
} from '@material-ui/core'

export const Swagger = () => {
  const classes = useStyles();

  return (
    <section className={classes.swagger}>
      <Typography variant="h4">API Documentation </Typography>
      <div className={classes.swaggerLinks}>
        <Link href="/docs">
          rest api
        </Link>

        <Link href="/docs">
          websocket api
        </Link>
      </div>
    </section>

  )
}

const useStyles = makeStyles((theme: Theme) => ({
  swagger: {
    margin: '2rem 0',
    padding: '0 2rem',

    '& *': {
      color: '#fff'
    }
  },
  swaggerLinks: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',

    '& a': {
      fontSize: '1rem',
      border: '2px #A567FF solid',
      padding: '1rem',
      textTransform: 'uppercase',
      width: '40rem',
      textAlign: 'center',
      borderRadius: '5px',
      marginTop: '2rem',

      '&:hover': {
        textDecoration: 'none'
      }
    }
  }
}))
