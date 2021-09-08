import { Channel as ChannelType } from '../../utils'
import Channel from './Channels'

type ChannelContainerProps = {
  channel: ChannelType
  did?: string
}

export const ChannelContainer = ({ channel, did }: ChannelContainerProps) => {
  return (
    <Channel
      channel={channel}
      myDID={did}
    />
  )
}
