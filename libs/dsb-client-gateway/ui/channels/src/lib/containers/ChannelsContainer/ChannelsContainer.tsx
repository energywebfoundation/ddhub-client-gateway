import { ModalProvider } from '../../context';
import { ChannelList } from '../../components/ChannelList/ChannelList';
import { ModalCenter } from '../modals/ModalCenter/ModalCenter';

export function ChannelsContainer() {
  return (
    <ModalProvider>
      <ChannelList />
      <ModalCenter />
    </ModalProvider>
  );
}
