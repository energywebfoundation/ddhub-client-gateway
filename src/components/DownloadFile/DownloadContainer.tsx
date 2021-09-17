import { Download } from './Download'
import { Channel } from '../../utils'

type DownloadContainerProps = {
  channels: Channel[] | undefined
}

export const DownloadContainer = ({ channels }: DownloadContainerProps) => {
  return <Download channels={channels} />
}
