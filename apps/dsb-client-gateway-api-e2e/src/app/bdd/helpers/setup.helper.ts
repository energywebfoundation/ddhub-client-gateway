import { INestApplication } from '@nestjs/common';
import {
  AcksWrapperRepository,
  ApplicationWrapperRepository,
  ChannelWrapperRepository,
  CronWrapperRepository,
  DidWrapperRepository,
  EnrolmentWrapperRepository,
  EventsWrapperRepository,
  FileMetadataWrapperRepository,
  IdentityRepositoryWrapper,
  SymmetricKeysRepositoryWrapper,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

export const clearDatabase = async (
  app: () => INestApplication
): Promise<void> => {
  const ref = app();

  // @TODO - Standardize wrappers or get rid of them (replace with repository token?)
  await ref.get(TopicRepositoryWrapper).topicRepository.clear();
  await ref.get(IdentityRepositoryWrapper).identityRepository.clear();
  await ref.get(ChannelWrapperRepository).channelRepository.clear();
  await ref.get(SymmetricKeysRepositoryWrapper).symmetricKeysRepository.clear();
  await ref.get(AcksWrapperRepository).acksRepository.clear();
  await ref.get(ApplicationWrapperRepository).repository.clear();
  await ref.get(CronWrapperRepository).cronRepository.clear();
  await ref.get(DidWrapperRepository).didRepository.clear();
  await ref.get(EnrolmentWrapperRepository).enrolmentRepository.clear();
  await ref.get(EventsWrapperRepository).repository.clear();
  await ref.get(FileMetadataWrapperRepository).repository.clear();
  // await ref.get(TopicMonitorRepositoryWrapper).topicRepository.clear();

  console.log('database clear');
};
