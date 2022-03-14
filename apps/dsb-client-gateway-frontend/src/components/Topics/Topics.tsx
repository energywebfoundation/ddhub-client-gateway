import { makeStyles } from '@material-ui/styles'
import { useState } from 'react'
import {
    Theme,
    Typography,
    withStyles,
    Button

} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Topic as TopicType } from '../../utils'
import { JsonView, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import Table from '../Table/Table'
import SimpleDialog from '../../pages/topicdialog'

import { TOPIC_HEADERS as topicHeaders } from '../../utils'

type TopicProps = {
    applicationName: string | string[] | undefined
    topics: TopicType[] | undefined
    myDID?: string,
    handlePostTopic: (body: TopicType) => void
    handleUpdateTopic: (body: TopicType) => void
}

export default function Topic({ applicationName, topics, myDID, handlePostTopic, handleUpdateTopic }: TopicProps) {
    const classes = useStyles()
    const [open, setOpen] = useState(false)

    let dialogTitle = 'Create Topic'
    let dialogText = 'Provide Topic data with this form'
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <section className={classes.connectionStatus}>
                <Typography variant="h4">{applicationName}</Typography>
            </section>
            <div style={{ display: "flex" }}>
                <section className={classes.searchText}>

                    <Button style={{ justifyContent: 'flex-end' }}
                        className={classes.connectionStatusPaper}
                        onClick={handleClickOpen}>
                        Create
                    </Button>

                </section>

                <SimpleDialog
                    onClose={handleClose}
                    open={open}
                    dialogTitle={dialogTitle}
                    dialogText={dialogText}
                    handlePostOrUpdateTopic={handlePostTopic}
                />
            </div>

            <Table
                headers={topicHeaders}
                dataRows={topics}
                handleUpdateTopic={handleUpdateTopic}
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
    },
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
}))
