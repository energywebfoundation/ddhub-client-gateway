import Link from 'next/link'
import { Button, Container, makeStyles, Theme } from '@material-ui/core';
import Header from "../../components/Header/Header";

export default function Docs() {
    const classes = useStyles()
    return (
        <div>
            <Header />
            <Container className={classes.container}>
                <div className={classes.button}>
                    <Link href="/docs/rest" passHref={true}>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                        >
                            REST API
                        </Button>
                    </Link>
                </div>
                <div className={classes.button}>
                    <Link href="/docs/ws" passHref={true}>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                        >
                            WebSocket API
                        </Button>
                    </Link>
                </div>
            </Container>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        maxWidth: '500px'
    },
    button: {
        margin: '2rem 0'
    }
}))
