import React from 'react';
import { makeStyles } from '@material-ui/styles'
import {
  Theme,
} from '@material-ui/core';
import { ChannelContainer } from 'components/Channel/ChannelContainer';


export const AvailableChannel = () => {
  const classes = useStyles();
  const channels = [
    {key: '{participantName}.channels.{project}.apps.{org}.iam.ewc', channelId: 1},
    {key: '{AEMOChannel}.channels.{project}.apps.{org}.iam.ewc', channelId: 2}
  ]

	return (
		<section className={classes.availableChannel}>
      {
        channels.map(channel => 
          <ChannelContainer key={channel.channelId} channel={channel.key} />
        )
      }
		</section>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  availableChannel: {
    padding: theme.spacing(6),
    margin: theme.spacing(3, 30)
  },
}))
