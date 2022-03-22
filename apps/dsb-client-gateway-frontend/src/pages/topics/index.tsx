import { useEffect, useState } from 'react'
import Head from 'next/head'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { makeStyles } from '@mui/styles'
import { Container, Theme, } from '@mui/material'
import swal from '@sweetalert/with-react'
import { TopicContainer } from '../../components/Topics/TopicsContainer'
import ResponsiveHeader from '../../components/ResponsiveHeader/ResponsiveHeader'
import { refreshState } from '../../services/identity.service'
import { isAuthorized } from '../../services/auth.service'
import { ErrorCode, Option, Topic } from '../../utils'
import axios from 'axios'

type Props = {
    ownerDid: string
    owner: string
    auth: Option<string>
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{
    props: Props
}> {

    const authHeader = context.req.headers.authorization
    const owner = context.req['query'].owner




    const { err } = isAuthorized(authHeader)

    const state = await refreshState()
    const did = state.ok?.enrolment?.did

    if (!err) {
        return {
            props: {
                owner: owner,
                ownerDid: did,
                auth: authHeader ? { some: authHeader } : { none: true }
            }
        }
    } else {
        if (err.message === ErrorCode.UNAUTHORIZED) {
            context.res.statusCode = 401
            context.res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"')
        } else {
            context.res.statusCode = 403
        }
        return {
            props: {
                owner: '',
                ownerDid: '',
                auth: { none: true }
            }
        }
    }
}


export default function ListTopics({ owner, ownerDid, auth }:
    InferGetServerSidePropsType<typeof getServerSideProps>) {
    const classes = useStyles()

    const [topics, setTopics] = useState<Topic[]>();
    const [health, setHealth] = useState('');

    useEffect(() => {

        async function getServerSideProps() {

            const topicsResponse = await axios.get(`/v1/dsb/topics`,
                {
                    headers: {
                        Authorization: auth ? `Bearer ${auth}` : undefined,
                        'content-type': 'application/json',
                    },
                    params: { ownerDid: ownerDid },
                }
            );

            if (topicsResponse.status !== 200) {
                return swal('Error', topicsResponse.data.reason, 'error')
            }

            setTopics(topicsResponse.data.records)


            const healthResponse = await axios.get(`/v1/dsb/health`, {
                headers: {
                    Authorization: auth ? `Bearer ${auth}` : undefined,
                    'content-type': 'application/json',
                },
            });

            setHealth(healthResponse.data)

            if (healthResponse.status !== 200) {
                return swal('Error', healthResponse.data.reason, 'error')
            }

        }

        getServerSideProps()
    }, [auth, ownerDid])

    return (
        <div>
            <Head>
                <title>EW-DSB Client Gateway - Topic List</title>
                <meta name="description" content="EW-DSB Client Gateway" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <ResponsiveHeader />
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

const useStyles = makeStyles((theme: Theme) => ({
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
