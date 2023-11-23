import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CleanupCommand } from '../command/cleanup.command';
import {
  AddressBookRepositoryWrapper,
  ApplicationWrapperRepository,
  AssociationKeysWrapperRepository,
  ChannelWrapperRepository,
  ClientWrapperRepository,
  CronWrapperRepository,
  DidWrapperRepository,
  EventsWrapperRepository,
  FileMetadataEntity,
  FileMetadataWrapperRepository,
  ReceivedMessageMappingRepositoryWrapper,
  ReceivedMessageReadStatusRepositoryWrapper,
  ReceivedMessageRepositoryWrapper,
  SentMessageRecipientRepositoryWrapper,
  SentMessageRepositoryWrapper,
  SymmetricKeysRepositoryWrapper,
  TopicMonitorRepositoryWrapper,
  TopicRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@CommandHandler(CleanupCommand)
export class CleanupHandler implements ICommandHandler<CleanupCommand> {
  protected readonly logger = new Logger(CleanupHandler.name);
  protected readonly downloadPath: string;
  protected readonly ext: string = '.enc';

  constructor(
    protected readonly channelWrapperRepository: ChannelWrapperRepository,
    protected readonly topicWrapperRepository: TopicRepositoryWrapper,
    protected readonly topicMonitorWrapperRepository: TopicMonitorRepositoryWrapper,
    protected readonly addressBookRepository: AddressBookRepositoryWrapper,
    protected readonly applicationsRepository: ApplicationWrapperRepository,
    protected readonly associationKeysRepositoryWrapper: AssociationKeysWrapperRepository,
    protected readonly clientsRepositoryWrapper: ClientWrapperRepository,
    protected readonly cronRepositoryWrapper: CronWrapperRepository,
    protected readonly didRepositoryWrapper: DidWrapperRepository,
    protected readonly eventsRepositoryWrapper: EventsWrapperRepository,
    protected readonly fileMetadataRepositoryWrapper: FileMetadataWrapperRepository,
    protected readonly sentMessagesRepository: SentMessageRepositoryWrapper,
    protected readonly receivedMessagesRepository: ReceivedMessageRepositoryWrapper,
    protected readonly receivedMessagesMappingRepositorWrapper: ReceivedMessageMappingRepositoryWrapper,
    protected readonly receivedMessagesReadWrapper: ReceivedMessageReadStatusRepositoryWrapper,
    protected readonly sentMessageRecipientWrapper: SentMessageRecipientRepositoryWrapper,
    protected readonly symmetricKeysRepositoryWrapper: SymmetricKeysRepositoryWrapper,
    protected readonly configService: ConfigService,
  ) {
    this.downloadPath = configService.get<string>('DOWNLOAD_FILES_DIR');
  }

  public async execute(): Promise<void> {
    await Promise.all([
      this.channelWrapperRepository.channelRepository.delete({}),
      this.topicMonitorWrapperRepository.topicRepository.delete({}),
      this.topicWrapperRepository.topicRepository.delete({}),
      this.addressBookRepository.repository.delete({}),
      this.applicationsRepository.repository.delete({}),
      this.associationKeysRepositoryWrapper.repository.delete({}),
      this.clientsRepositoryWrapper.repository.delete({}),
      this.cronRepositoryWrapper.cronRepository.delete({}),
      this.didRepositoryWrapper.didRepository.delete({}),
      this.eventsRepositoryWrapper.repository.delete({}),
      this.sentMessageRecipientWrapper.repository.delete({}),
      this.receivedMessagesMappingRepositorWrapper.repository.delete({}),
      this.receivedMessagesReadWrapper.repository.delete({}),
      this.receivedMessagesRepository.repository.delete({}),
      this.sentMessagesRepository.repository.delete({}),
      this.symmetricKeysRepositoryWrapper.symmetricKeysRepository.delete({}),
    ]).catch((e) => {
      this.logger.error('failed to cleanup data');
      this.logger.error(e);
    });

    const allFiles: FileMetadataEntity[] =
      await this.fileMetadataRepositoryWrapper.repository.find();

    for (const file of allFiles) {
      const fullPath = join(this.downloadPath, file.fileId + this.ext);

      try {
        await this.fileMetadataRepositoryWrapper.repository.delete({
          fileId: file.fileId,
        });
        fs.unlinkSync(fullPath);
      } catch (e) {
        this.logger.error('failed to unlick file on path ' + fullPath);
        this.logger.error(e);
      }
    }
  }
}
