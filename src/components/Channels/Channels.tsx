import React from 'react'
import { makeStyles } from '@material-ui/styles'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Theme, Typography, withStyles,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Channel as ChannelType } from '../../utils'
import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

type ChannelProps = {
  channel: ChannelType,
  myDID?: string
}

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

export default function Channel({
  channel,
  myDID,
}: ChannelProps) {
  const classes = useStyles();

  const isPubSub = () => {
    if (!myDID) {
      return
    }
    const pub = channel.publishers?.includes(myDID)
    const sub = channel.subscribers?.includes(myDID)
    if (pub && sub) {
      return 'pub/sub'
    }
    if (pub) {
      return 'pub'
    }
    if (sub) {
      return 'sub'
    }
  }

  return (
    <div className={classes.container}>
      <Accordion className={classes.accordion}>

        <AccordionSummary className={classes.accordionTitle} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.name} variant="h5">{channel.fqcn}</Typography>
          <Typography variant="h6">{isPubSub()}</Typography>
        </AccordionSummary>

        <AccordionDetails className={classes.channelDetail}>
          <div>
            <Typography className={classes.sectionTitle} variant="h6">Topics</Typography>
          </div>

          <div>
            {channel.topics?.map((topic) => (
              <Accordion key={topic.namespace}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.name} variant="h6">{topic.namespace}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <JsonView
                    data={typeof topic.schema === 'string' ? JSON.parse(topic.schema) : topic.schema}
                    shouldInitiallyExpand={(level) => level !== 1}
                    style={{
                      ...defaultStyles,
                      container: classes.jsonContainer
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </div>

        </AccordionDetails>

      </Accordion>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    margin: '2rem'
  },
  accordion: {
    backgroundColor: theme.palette.background.paper
  },
  accordionTitle: {
    '& div': {
      display: 'flex',
      justifyContent: 'space-between',
    }
  },
  name: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    margin: '1rem 0'
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

const duration = 500

const defaultStyle = {
  transition: `transform 200ms, opacity ${duration}ms ease`,
  opacity: 1
};

const transitionStyles = {
  entering: { opacity: 0, display: 'block' },
  entered: { opacity: 1},
  exiting: { opacity: 0 },
  exited: { opacity: 0, display: 'none' }
};
