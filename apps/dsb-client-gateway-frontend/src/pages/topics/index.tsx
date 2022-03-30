import { useState } from 'react';
import Head from 'next/head';
import { makeStyles } from 'tss-react/mui';
import { Container } from '@mui/material';
import { TopicContainer } from '../../components/Topics/TopicsContainer';
import { Topic } from '../../utils';

export default function ListTopics({ owner, ownerDid, auth }) {
    const { classes } = useStyles()

    const [topics, setTopics] = useState<Topic[]>();

    return (
        <div>
            <Head>
                <title>EW-DSB Client Gateway - Topic List</title>
                <meta name="description" content="EW-DSB Client Gateway" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Container maxWidth="lg">
                    <section className={classes.table}>
                        {topics ? <TopicContainer
                            applicationNameSpace={owner}
                            auth={auth.some}
                            topics={topics} /> : null}
                    </section>

                </Container>
            </main>
        </div >
    )
}

const useStyles = makeStyles()((theme) => ({
    connectionStatus: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',

        '& *': {
            color: '#fff'
        }
    },
    searchText: {
        display: 'flex',
        paddingTop: '1rem',
        alignItems: 'center',
        'font-size': '8 px',
        '& *': {
            color: '#6E6B7B'
        }
    },
    connectionStatusPaper: {
        padding: '.5rem 1rem',
        marginLeft: '1rem',
        background: theme.palette.secondary.main,
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        color: '#FFFFFF',
        justifyContent: 'flex-end'

    },
    div: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    divider: {
        background: '#1E263C',
        margin: '3rem 0'
    },
    main: {
        padding: '0 2rem'
    },
    textWhite: {
        color: '#fff'
    },
    table: {
        marginTop: '1rem',
    },
    navLink: {
        fontSize: '1rem',

        '&:hover': {
            textDecorationLine: 'underline',
            color: theme.palette.secondary.main
        }
    },
    active: {
        color: theme.palette.secondary.main
    }
}))
