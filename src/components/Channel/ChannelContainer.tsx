import React, {useState} from 'react'
import Channel from './Channel'

export const ChannelContainer = ({channel}: {channel: string}) => {
  const [isChannelOpen, setChannelOpen] = useState<boolean>(false);

  return (
    <div onClick={() => setChannelOpen(!isChannelOpen)}>
      <Channel 
        channel={channel}
        isChannelOpen={isChannelOpen}
      />
    </div>
  )
}

