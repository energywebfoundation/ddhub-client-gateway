import React from 'react'
import { makeStyles } from '@material-ui/styles'
import {
  Theme, Typography,
} from '@material-ui/core';
import { ArrowDropDownSharp } from '@material-ui/icons';
import { Transition } from 'react-transition-group';

type ChannelProps = {
  channel: string,
  isChannelOpen: boolean
}

export default function Channel({
  channel,
  isChannelOpen,
}: ChannelProps) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.channel}>
        <Typography variant="caption">{channel}</Typography>
        <ArrowDropDownSharp />
      </div>

      {
        (
          <Transition
            timeout={duration}
            in={isChannelOpen}
          >
            {state => (
              <div
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state]
                }}
              >
                <pre className={classes.pre}>
                  {
                    `
{
  fqcn: string;
  metadata?: {
    topics: {
      namespace: string;
      schemaType: "json" | "xml";
      schema: string;
    }[];
    publisherRoles: string[];
    subscriberRoles: string[];
    channelAdmin: string[];
    maxMsgAge: number; // in seconds
    maxMsgSize: number; // in bytes
  }
  createdBy: string; // added by messagebroker to store in addressbook
  createdDateTime: string; // added by messagebroker to store in addressbook
}
                    `
                  }
                </pre>
              </div>
            )}
          </Transition>
        )
      }
    </>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
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
  pre: {
    background: '#000',
    color: '#fff',
    textAlign: 'left',
    whiteSpace: 'break-spaces'
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
