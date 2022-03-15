import { makeStyles } from '@material-ui/styles'
import {
    AccordionSummary as MuiAccordionSummary,
    Theme,
} from '@material-ui/core'
import { Application as ApplicationType } from '../../utils'
import 'react-json-view-lite/dist/index.css'
import Table from '../Table/Table'

import { APPLICATIONS_HEADERS as applicationHeaders } from '../../utils/constants'

type TopicProps = {
    applications: ApplicationType[] | undefined
    myDID?: string
}

// take this data by calling API made by chris


export default function Application({ applications, myDID }: TopicProps) {
    const classes = useStyles()
    return (
        <div >
            {/* <div className={classes.navbar}></div> */}
            <Table
                headers={applicationHeaders}
                dataRows={applications}
                location='Application'
            />
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) => ({

    navbar: {
        position: 'absolute',
        background: '#293145',
        left: '0%',
        right: '0%',
        top: '0%',
        bottom: '0%'
    },
    container: {
        margin: '2rem'
    },
    accordion: {
        backgroundColor: theme.palette.secondary.light
    },
    accordionTitle: {
        color: theme.palette.info.contrastText,
        '& div': {
            display: 'flex',
            justifyContent: 'space-between'
        }
    },
    name: {
        fontWeight: 'bold'
    },
    sectionTitle: {
        margin: '1rem 0.5rem',
        color: theme.palette.info.contrastText,
        textDecorationStyle: 'wavy'
    },
    channelDetail: {
        display: 'flex',
        flexDirection: 'column'
    },
    channel: {
        color: '#fff',
        background: '#52446F',
        padding: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        '& span': {
            fontSize: '.9rem'
        },
        '&:hover': {
            cursor: 'pointer'
        }
    },
    jsonContainer: {
        fontFamily: 'monospace'
    }
}))