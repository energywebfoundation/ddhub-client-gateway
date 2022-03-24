import { makeStyles } from 'tss-react/mui';
import { Link, Typography } from '@mui/material'

export const Swagger = () => {
  const { classes } = useStyles()

  return (
    <section className={classes.swagger}>
      <Typography variant="h4">API Documentation </Typography>
      <div className={classes.swaggerLinks}>
        <Link href="/docs">rest api</Link>

        <Link href="/docs">websocket api</Link>
      </div>
    </section>
  )
}

const useStyles = makeStyles()((theme) => ({
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
