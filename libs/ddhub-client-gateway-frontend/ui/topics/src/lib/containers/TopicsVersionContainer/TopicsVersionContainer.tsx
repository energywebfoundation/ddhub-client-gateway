import { FC } from 'react';
import { TopicsModalsProvider } from '../../context';
import { TopicsModalsCenter } from '../modals';
import { TopicVersionDetails, TopicVersionDetailsProps } from '../../components';

export const TopicsVersionContainer: FC<TopicVersionDetailsProps> =
  ({
     topicVersionDetails,
     fields,
  }: TopicVersionDetailsProps) => {
  return (
    <TopicsModalsProvider>
      <TopicVersionDetails topicVersionDetails={topicVersionDetails} fields={fields}></TopicVersionDetails>
      <TopicsModalsCenter />
    </TopicsModalsProvider>
  );
};
