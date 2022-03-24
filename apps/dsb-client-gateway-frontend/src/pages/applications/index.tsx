import { useEffect, useState } from 'react'
import Head from 'next/head'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { makeStyles } from 'tss-react/mui'
import { Container } from '@mui/material'
import swal from '@sweetalert/with-react'
import { ApplicationContainer } from '../../components/Applications/ApplicationsContainer'
import ResponsiveHeader from '../../components/ResponsiveHeader/ResponsiveHeader'
import { isAuthorized } from '../../services/auth.service'
import { refreshState } from '../../services/identity.service'
import { ErrorCode, Result, serializeError, Option, ErrorBodySerialized, Storage } from '../../utils'
import axios from 'axios'
import { IAppDefinition } from '@energyweb/iam-contracts'

type Props = {
    state: Result<Storage, ErrorBodySerialized>
    auth: Option<string>
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{
    props: Props
}> {
    const authHeader = context.req.headers.authorization
    const { err } = isAuthorized(authHeader)
    if (!err) {

        const state = await refreshState()


        return {
            props: {
                state: serializeError(state),
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
                state: {},
                auth: { none: true }
            }
        }
    }
}
export default function ListApplications({ state, auth }:
    InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { classes } = useStyles()
    const [applications, setApplications] = useState<IAppDefinition[]>([]);
    const [health, setHealth] = useState<{ statusCode: number; message?: string }>();

    useEffect(() => {
        const did = state.ok?.enrolment?.did

        async function getServerSideProps() {

            const applicationsResponse = await axios.get(`/v1/dsb/applications`,
                {
                    headers: {
                        Authorization: auth ? `Bearer ${auth}` : undefined,
                        'content-type': 'application/json',
                    },
                    params: { ownerDid: did },
                }
            );

            setApplications(applicationsResponse.data)


            const healthResponse = await axios.get(`/v1/dsb/health`, {
                headers: {
                    Authorization: auth ? `Bearer ${auth}` : undefined,
                    'content-type': 'application/json',
                },
            });
            setHealth(healthResponse.data)

        }

        getServerSideProps()

    }, [auth, state])


    return (
        <div>
            <Head>
                <title>EW-DSB Client Gateway - Applications List</title>
                <meta name="description" content="EW-DSB Client Gateway" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <ResponsiveHeader />
                <Container maxWidth="lg">
                    <section className={classes.table}>
                        {applications ? <ApplicationContainer auth={auth.some} applications={applications} /> : null}
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
