import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { makeStyles } from '@material-ui/styles'
import { Typography, Container, Divider, Theme, TextField, IconButton, Button } from '@material-ui/core'
import swal from '@sweetalert/with-react'
import { ApplicationContainer } from '../../components/Applications/ApplicationsContainer'
import ResponsiveHeader from '../../components/ResponsiveHeader/ResponsiveHeader'
import { DsbApiService } from '../../services/dsb-api.service'
import { isAuthorized } from '../../services/auth.service'
import { ErrorCode, Result, serializeError, Channel, Option, ErrorBodySerialized, Topic } from '../../utils'
import SimpleDialog from '../topicdialog'

type Props = {
    health: Result<boolean, ErrorBodySerialized>
    // channels: Result<Channel[], ErrorBodySerialized>
    // topics: Result<Topic[], ErrorBodySerialized>
    auth: Option<string>
}
// take this data by calling API made by chris
const applicationsData = [
    {
        applicationLogo: '',
        applicationName: 'Application Name 1',
        applicationNameSpace: 'edge.apps.aemo.iam.ewc',
        topicsCount: 6,
        modeifiedDateTime: '12/21/2021'
    },
    {
        applicationLogo: '',
        applicationName: 'Application Name 2',
        applicationNameSpace: 'edge.apps.aemo.iam.ewc',
        topicsCount: 6,
        modeifiedDateTime: '12/21/2021'
    },
    {
        applicationLogo: '',
        applicationName: 'Application Name 3',
        applicationNameSpace: 'edge.apps.aemo.iam.ewc',
        topicsCount: 6,
        modeifiedDateTime: '12/21/2021'
    },
    {
        applicationLogo: '',
        applicationName: 'Application Name 4',
        applicationNameSpace: 'edge.apps.aemo.iam.ewc',
        topicsCount: 6,
        modeifiedDateTime: '12/21/2021'
    },
    {
        applicationLogo: '',
        applicationName: 'Application Name 5',
        applicationNameSpace: 'edge.apps.aemo.iam.ewc',
        topicsCount: 6,
        modeifiedDateTime: '12/21/2021'
    },
    {
        applicationLogo: '',
        applicationName: 'Application Name 6',
        applicationNameSpace: 'edge.apps.aemo.iam.ewc',
        topicsCount: 6,
        modeifiedDateTime: '12/21/2021'
    }
]
export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{
    props: Props
}> {
    const authHeader = context.req.headers.authorization
    const { err } = isAuthorized(authHeader)
    if (!err) {
        const health = await DsbApiService.init().getHealth()
        // const channels = await DsbApiService.init().getChannels()
        // const topics = await DsbApiService.init().getTopics()
        return {
            props: {
                health: serializeError(health),
                // channels: serializeError(channels),
                // topics: serializeError(topics),
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
                health: {},
                // channels: {},
                // topics: {},
                auth: { none: true }
            }
        }
    }
}
export default function ListApplications({ health, auth }:
    InferGetServerSidePropsType<typeof getServerSideProps>) {
    const classes = useStyles()
    // useEffect(() => {
    //     if (health.err) {
    //         return swal('Error', health.err.reason, 'error')
    //     }
    //     if (channels.err) {
    //         console.log('channels.err', channels.err)
    //         return swal('Error', channels.err.reason, 'error')
    //     }
    //     if (topics.err) {
    //         console.log('channels.err', channels.err)
    //         return swal('Error', topics.err.reason, 'error')
    //     }
    // }, [health, channels, topics])
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
                        <ApplicationContainer auth={auth.some} applications={applicationsData} />
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