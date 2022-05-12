import { FC } from 'react';
import { Create } from '../Create/Create';
import { Details } from '../Details';
import { Update } from '../Update';
import { ChannelTopicDetails } from '../ChannelTopicDetails';

export const ModalCenter: FC = () => {
  return (
    <>
      <Create />
      <Update />
      <Details />
      <ChannelTopicDetails />
    </>
  );
};
