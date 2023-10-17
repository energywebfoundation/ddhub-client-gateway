import { MessageService } from './message.service';
import { Test } from '@nestjs/testing';
import { SecretsEngineService } from '@dsb-client-gateway/dsb-client-gateway-secrets-engine';
import { EventsGateway } from '../gateway/events.gateway';
import { WsClientService } from './ws-client.service';
import { ConfigService } from '@nestjs/config';
import { ChannelService } from '../../channel/service/channel.service';
import { KeysService } from '../../keys/service/keys.service';
import {
  AckResponse,
  DdhubFilesService,
  DdhubMessagesService,
  DdhubTopicsService,
} from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import {
  ChannelType,
  DidEntity,
  FileMetadataWrapperRepository,
  PendingAcksWrapperRepository,
  TopicEntity,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { ReqLockService } from './req-lock.service';
import { AssociationKeysService } from '@dsb-client-gateway/ddhub-client-gateway-association-keys';
import { MessageStoreService } from './message-store.service';
import { OfflineMessagesService } from './offline-messages.service';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';
import {
  GetMessageResponse,
  SearchMessageResponseDto,
  SendMessageResponse,
} from '../message.interface';
import { SendMessageDto } from '../dto/request/send-message.dto';
import { TopicNotFoundException } from '../exceptions/topic-not-found.exception';
import { TopicService } from '../../channel/service/topic.service';
import { RecipientsNotFoundException } from '../exceptions/recipients-not-found-exception';
import { ChannelTypeNotPubException } from '../exceptions/channel-type-not-pub.exception';
import { TopicNotRelatedToChannelException } from '../exceptions/topic-not-related-to-channel.exception';
import { SchemaNotValidException } from '../exceptions/schema-not-valid.exception';
import {
  EncryptedMessageType,
  EncryptionStatus,
  SchemaType,
} from '../message.const';
import { MalformedJSONException } from '../exceptions/malformed-json.exception';

const mockSecretsEngineService = {
  getPrivateKey: jest.fn(),
};
const mockEventsGateway = {};
const mockWsClient = {};
const mockConfigService = {
  get: jest.fn(),
};
const mockChannelService = {
  getChannelOrThrow: jest.fn(),
};
const mockTopicService = {
  getTopic: jest.fn(),
  getTopicById: jest.fn(),
};
const mockKeysService = {
  generateRandomKey: jest.fn(),
  encryptMessage: jest.fn(),
  encryptSymmetricKey: jest.fn(),
  decryptMessage: jest.fn(),
  verifySignature: jest.fn(),
  createSignature: jest.fn(),
  prefetchSignatureKeys: jest.fn(),
};
const mockDdhubMessageService = {
  sendMessageInternal: jest.fn(),
  messagesSearch: jest.fn(),
  messagesAckBy: jest.fn(),
  sendMessage: jest.fn(),
};
const mockDdhubFilesService = {};
const mockFileMetadataWrapper = {};
const mockReqLockService = {};
const mockPendingAcksWrapperRepository = {
  pendingAcksRepository: {
    find: jest.fn(),
    save: jest.fn(),
  },
};
const mockAssocationKeysService = {
  getCurrentKey: jest.fn(),
};
const mockMessageStoreService = {
  storeReceivedMessage: jest.fn(),
  storeRecipients: jest.fn(),
  storeSentMessage: jest.fn(),
};
const mockOfflineMessagesService = {
  getOfflineReceivedMessages: jest.fn(),
};
const mockIamService = {
  getDIDAddress: jest.fn(),
};

describe(`${MessageService.name}`, () => {
  let service: MessageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: SecretsEngineService,
          useValue: mockSecretsEngineService,
        },
        {
          provide: EventsGateway,
          useValue: mockEventsGateway,
        },
        {
          provide: WsClientService,
          useValue: mockWsClient,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: ChannelService,
          useValue: mockChannelService,
        },
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
        {
          provide: KeysService,
          useValue: mockKeysService,
        },
        {
          provide: DdhubMessagesService,
          useValue: mockDdhubMessageService,
        },
        {
          provide: DdhubFilesService,
          useValue: mockDdhubFilesService,
        },
        {
          provide: FileMetadataWrapperRepository,
          useValue: mockFileMetadataWrapper,
        },
        {
          provide: ReqLockService,
          useValue: mockReqLockService,
        },
        {
          provide: PendingAcksWrapperRepository,
          useValue: mockPendingAcksWrapperRepository,
        },
        {
          provide: AssociationKeysService,
          useValue: mockAssocationKeysService,
        },
        {
          provide: MessageStoreService,
          useValue: mockMessageStoreService,
        },
        {
          provide: OfflineMessagesService,
          useValue: mockOfflineMessagesService,
        },
        {
          provide: IamService,
          useValue: mockIamService,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeInstanceOf(MessageService);
  });

  describe('getMessagesWithReqLock()', () => {
    it.todo('should clear lock on failure');
    it.todo('should successfully release lock');
  });

  describe('getMessages()', () => {
    let error: Error | null;
    let result: GetMessageResponse[] | null;

    beforeEach(() => {
      jest.resetAllMocks();

      result = null;
      error = null;
    });

    it.todo(
      'should not fetch messages as topic from channel does not match topic from request'
    );

    describe('should fetch messages', () => {
      beforeEach(async () => {
        mockTopicService.getTopic = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              owner: 'topicOwner',
              name: 'topicName',
              id: 'topicId',
            };
          });

        mockKeysService.decryptMessage = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              error: null,
              decrypted: 'decrypted-message',
            };
          });

        mockKeysService.verifySignature = jest
          .fn()
          .mockImplementationOnce(async () => true);

        mockPendingAcksWrapperRepository.pendingAcksRepository.find = jest
          .fn()
          .mockImplementationOnce(async () => []);

        mockDdhubMessageService.messagesSearch = jest
          .fn()
          .mockImplementationOnce(async () => {
            return [
              {
                topicId: 'topicId',
                payload: 'payload',
                clientGatewayMessageId: 'cgwid',
                initiatingMessageId: undefined,
                payloadEncryption: true,
                isFile: false,
                initiatingTransactionId: undefined,
                topicVersion: '0.0.1',
                messageId: 'messageId',
                transactionId: 'transactionId',
                senderDid: 'senderDid',
                signature: 'signature',
                timestampNanos: 1,
              },
            ] as Array<SearchMessageResponseDto>;
          });

        mockKeysService.prefetchSignatureKeys = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              senderDid: {
                did: 'senderDid',
                publicSignatureKey: 'publicSignatureKey',
                publicRSAKey: 'publicRsaKey',
                updatedDate: new Date(),
                createdDate: new Date(),
              },
            } as Record<string, DidEntity | null>;
          });

        mockTopicService.getTopicById = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              owner: 'topicOwner',
              name: 'topicName',
              id: 'topicId',
              schemaType: SchemaType.JSD7,
            };
          });

        mockChannelService.getChannelOrThrow = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              messageForms: false,
              useAnonymousExtChannel: false,
              fqcn: 'fqcn', // it doesn't matter in that test case if we send full channel, it's not important here
              conditions: {
                topics: [
                  {
                    topicName: 'topicName',
                    owner: 'topicOwner',
                    topicId: 'topicId',
                  },
                ],
                qualifiedDids: ['did1'],
              },
              type: ChannelType.SUB,
            };
          });

        try {
          result = await service.getMessages(
            {
              fqcn: 'fqcn',
              topicOwner: 'topicOwner',
              topicName: 'topicName',
              amount: 1,
              clientId: 'clientId',
            },
            true,
            false
          );
        } catch (e) {
          error = e;
        }
      });

      it('result should contain message', () => {
        expect(result.length).toBe(1);

        const message = result[0];

        expect(message).toEqual({
          id: 'messageId',
          topicName: 'topicName',
          topicOwner: 'topicOwner',
          topicVersion: '0.0.1',
          topicSchemaType: SchemaType.JSD7,
          payload: 'decrypted-message',
          signature: 'signature',
          sender: 'senderDid',
          timestampNanos: 1,
          transactionId: 'transactionId',
          signatureValid: EncryptionStatus.SUCCESS,
          decryption: {
            status: EncryptionStatus.SUCCESS,
          },
          initiatingMessageId: undefined,
          initiatingTransactionId: undefined,
          payloadEncryption: true,
          clientGatewayMessageId: 'cgwid',
          topicId: 'topicId',
        });
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should not get association key as useAnonymousExtChannel is false', () => {
        expect(mockAssocationKeysService.getCurrentKey).toBeCalledTimes(0);
      });

      it('should call messages search', () => {
        expect(mockDdhubMessageService.messagesSearch).toBeCalledTimes(1);
        expect(mockDdhubMessageService.messagesSearch).toBeCalledWith(
          ['topicId'],
          ['did1'],
          ['topicId'],
          `clientId:fqcn`,
          undefined,
          1,
          undefined
        );
      });

      it('should prefetch signature keys', () => {
        expect(mockKeysService.prefetchSignatureKeys).toBeCalledTimes(1);
        expect(mockKeysService.prefetchSignatureKeys).toBeCalledWith([
          'senderDid',
        ]);
      });

      it('should verify message signature', () => {
        expect(mockKeysService.verifySignature).toBeCalledTimes(1);
        expect(mockKeysService.verifySignature).toBeCalledWith(
          'senderDid',
          'signature',
          'payload',
          expect.any(Object)
        );
      });

      it('should not store received message', () => {
        expect(mockMessageStoreService.storeReceivedMessage).toBeCalledTimes(0);
      });

      it('should add message to pending acks', () => {
        expect(
          mockPendingAcksWrapperRepository.pendingAcksRepository.save
        ).toBeCalledTimes(1);
        expect(
          mockPendingAcksWrapperRepository.pendingAcksRepository.save
        ).toBeCalledWith([
          {
            clientId: 'clientId:fqcn',
            messageId: 'messageId',
            from: undefined,
            anonymousRecipient: undefined,
            mbTimestamp: expect.any(Date),
          },
        ]);
      });

      it('should decrypt message', () => {
        expect(mockKeysService.decryptMessage).toBeCalledTimes(1);
        expect(mockKeysService.decryptMessage).toBeCalledWith(
          'payload',
          'cgwid',
          'senderDid'
        );
      });

      it('should verify pending acks', () => {
        expect(
          mockPendingAcksWrapperRepository.pendingAcksRepository.find
        ).toBeCalledTimes(1);
      });

      it('should call channel service to obtain channel', () => {
        expect(mockChannelService.getChannelOrThrow).toBeCalledTimes(1);
        expect(mockChannelService.getChannelOrThrow).toBeCalledWith('fqcn');
      });

      it('should not call getOfflineMessages', () => {
        expect(
          mockOfflineMessagesService.getOfflineReceivedMessages
        ).toBeCalledTimes(0);
      });
    });

    describe('should fetch offline messages because channel message forms is true', () => {
      beforeEach(async () => {
        mockOfflineMessagesService.getOfflineReceivedMessages = jest
          .fn()
          .mockImplementationOnce(async () => []);

        mockChannelService.getChannelOrThrow = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              messageForms: true,
              fqcn: 'fqcn', // it doesn't matter in that test case if we send full channel, it's not important here
            };
          });

        try {
          result = await service.getMessages(
            {
              fqcn: 'fqcn',
              topicOwner: 'topicOwner',
              topicName: 'topicName',
            },
            true,
            false
          );
        } catch (e) {
          error = e;
        }
      });

      it('should call channel service to obtain channel', () => {
        expect(mockChannelService.getChannelOrThrow).toBeCalledTimes(1);
        expect(mockChannelService.getChannelOrThrow).toBeCalledWith('fqcn');
      });

      it('should call getOfflineMessages', () => {
        expect(
          mockOfflineMessagesService.getOfflineReceivedMessages
        ).toBeCalledTimes(1);
        expect(
          mockOfflineMessagesService.getOfflineReceivedMessages
        ).toBeCalledWith({
          fqcn: 'fqcn',
          topicOwner: 'topicOwner',
          topicName: 'topicName',
        });
      });
    });
  });

  describe('getOfflineMessages()', () => {
    let error: Error | null;
    let result: GetMessageResponse[] | null;

    beforeEach(() => {
      jest.resetAllMocks();

      result = null;
      error = null;
    });

    describe('should return offline messages', () => {
      beforeEach(async () => {
        mockOfflineMessagesService.getOfflineReceivedMessages = jest
          .fn()
          .mockImplementationOnce(async () => []);

        try {
          result = await service.getOfflineMessages({
            fqcn: 'fqcn',
          });
        } catch (e) {
          error = e;
        }
      });

      it('should call getOfflineMessages', () => {
        expect(
          mockOfflineMessagesService.getOfflineReceivedMessages
        ).toBeCalledTimes(1);
        expect(
          mockOfflineMessagesService.getOfflineReceivedMessages
        ).toBeCalledWith({
          fqcn: 'fqcn',
        });
      });

      it('should call getOfflineMessages', () => {
        expect(
          mockOfflineMessagesService.getOfflineReceivedMessages
        ).toBeCalledTimes(1);
        expect(
          mockOfflineMessagesService.getOfflineReceivedMessages
        ).toBeCalledWith({
          fqcn: 'fqcn',
        });
      });
    });
  });

  describe('sendAckBy()', () => {
    let error: Error | null;
    let result: AckResponse | null;

    beforeEach(() => {
      jest.resetAllMocks();

      result = null;
      error = null;
    });

    describe('should send ack', () => {
      const messageIds: string[] = ['message1', 'message2'];
      const clientId = 'clientId';
      const from = 'date';

      beforeEach(async () => {
        try {
          mockDdhubMessageService.messagesAckBy = jest
            .fn()
            .mockImplementationOnce(async () => {
              return {
                acked: ['message1'],
                notFound: ['message2'],
              } as AckResponse;
            });

          result = await service.sendAckBy(messageIds, clientId, from);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).toEqual({
          acked: ['message1'],
          notFound: ['message2'],
        });
      });

      it('should call messagesAckBy', () => {
        expect(mockDdhubMessageService.messagesAckBy).toBeCalledTimes(1);
        expect(mockDdhubMessageService.messagesAckBy).toBeCalledWith(
          messageIds,
          clientId,
          from,
          undefined
        );
      });
    });
  });

  describe('sendMessage()', () => {
    let error: Error | null;
    let result: SendMessageResponse | null;

    beforeEach(() => {
      jest.resetAllMocks();

      result = null;
      error = null;
    });

    describe('should not send message if topic does not exists', () => {
      const messagePayload: SendMessageDto = {
        fqcn: 'fqcn',
        payload: 'some-payload',
        topicOwner: 'topicOwner',
        topicName: 'topicName',
        transactionId: 'transactionId',
        topicVersion: '0.0.1',
        anonymousRecipient: [],
      };

      beforeEach(async () => {
        mockChannelService.getChannelOrThrow = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              fqcn: 'fqcn', // it doesn't matter in that test case if we send full channel, it's not important here
            };
          });

        mockTopicService.getTopic = jest
          .fn()
          .mockImplementationOnce(async () => null);

        try {
          result = await service.sendMessage(messagePayload);
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(result).toBeNull();
        expect(error).toBeInstanceOf(TopicNotFoundException);
      });

      it('should call channel service to obtain channel', () => {
        expect(mockChannelService.getChannelOrThrow).toBeCalledTimes(1);
        expect(mockChannelService.getChannelOrThrow).toBeCalledWith('fqcn');
      });

      it('should call topic service to obtain topic', () => {
        expect(mockTopicService.getTopic).toBeCalledTimes(1);
        expect(mockTopicService.getTopic).toBeCalledWith(
          messagePayload.topicName,
          messagePayload.topicOwner,
          messagePayload.topicVersion
        );
      });
    });

    describe('should not send message as topic is not related to channel', () => {
      const messagePayload: SendMessageDto = {
        fqcn: 'fqcn',
        payload: 'some-payload',
        topicOwner: 'topicOwner',
        topicName: 'topicName',
        transactionId: 'transactionId',
        topicVersion: '0.0.1',
        anonymousRecipient: [],
      };

      beforeEach(async () => {
        mockChannelService.getChannelOrThrow = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              fqcn: 'fqcn', // it doesn't matter in that test case if we send full channel, it's not important here
              conditions: {
                topics: [
                  {
                    topicId: 'topicId',
                  },
                ],
                qualifiedDids: ['did1'],
              },
              type: ChannelType.SUB,
            };
          });

        mockTopicService.getTopic = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              name: 'name',
              id: 'not-related-id',
              schema: 'schema',
              schemaType: 'schemaType',
              version: '0.0.1',
            };
          });

        try {
          result = await service.sendMessage(messagePayload);
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(result).toBeNull();
        expect(error).toBeInstanceOf(TopicNotRelatedToChannelException);
      });

      it('should call channel service to obtain channel', () => {
        expect(mockChannelService.getChannelOrThrow).toBeCalledTimes(1);
        expect(mockChannelService.getChannelOrThrow).toBeCalledWith('fqcn');
      });

      it('should call topic service to obtain topic', () => {
        expect(mockTopicService.getTopic).toBeCalledTimes(1);
        expect(mockTopicService.getTopic).toBeCalledWith(
          messagePayload.topicName,
          messagePayload.topicOwner,
          messagePayload.topicVersion
        );
      });
    });

    describe('should not send message as channel type is not pub', () => {
      const messagePayload: SendMessageDto = {
        fqcn: 'fqcn',
        payload: 'some-payload',
        topicOwner: 'topicOwner',
        topicName: 'topicName',
        transactionId: 'transactionId',
        topicVersion: '0.0.1',
        anonymousRecipient: [],
      };

      beforeEach(async () => {
        mockChannelService.getChannelOrThrow = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              fqcn: 'fqcn', // it doesn't matter in that test case if we send full channel, it's not important here
              conditions: {
                topics: [
                  {
                    topicId: 'topicId',
                  },
                ],
                qualifiedDids: ['did1'],
              },
              type: ChannelType.SUB,
            };
          });

        mockTopicService.getTopic = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              name: 'name',
              id: 'topicId',
              schema: 'schema',
              schemaType: 'schemaType',
              version: '0.0.1',
            };
          });

        try {
          result = await service.sendMessage(messagePayload);
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(result).toBeNull();
        expect(error).toBeInstanceOf(ChannelTypeNotPubException);
      });

      it('should call channel service to obtain channel', () => {
        expect(mockChannelService.getChannelOrThrow).toBeCalledTimes(1);
        expect(mockChannelService.getChannelOrThrow).toBeCalledWith('fqcn');
      });

      it('should call topic service to obtain topic', () => {
        expect(mockTopicService.getTopic).toBeCalledTimes(1);
        expect(mockTopicService.getTopic).toBeCalledWith(
          messagePayload.topicName,
          messagePayload.topicOwner,
          messagePayload.topicVersion
        );
      });
    });

    describe('should send message with encryption', () => {
      const messagePayload: SendMessageDto = {
        fqcn: 'fqcn',
        payload: '{"data":1}',
        topicOwner: 'topicOwner',
        topicName: 'topicName',
        transactionId: 'transactionId',
        topicVersion: '0.0.1',
        anonymousRecipient: [],
      };

      beforeEach(async () => {
        mockMessageStoreService.storeSentMessage = jest
          .fn()
          .mockImplementationOnce(async () => undefined);

        mockSecretsEngineService.getPrivateKey = jest
          .fn()
          .mockImplementationOnce(async () => 'private_key');

        mockKeysService.generateRandomKey = jest
          .fn()
          .mockImplementationOnce(() => 'random_key');

        mockKeysService.encryptMessage = jest
          .fn()
          .mockImplementationOnce(() => 'encrypted-message');

        mockKeysService.createSignature = jest
          .fn()
          .mockImplementationOnce(() => 'generated-signature');

        mockKeysService.encryptSymmetricKey = jest
          .fn()
          .mockImplementationOnce(async () => 'encrypted-symmetric-key');

        mockDdhubMessageService.sendMessage = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              did: 'did1',
              recipients: {
                total: 1,
                sent: 1,
                failed: 0,
              },
              status: [
                {
                  name: 'message',
                  details: [
                    {
                      did: 'did1',
                      statusCode: 200,
                      messageId: 'messageId',
                    },
                  ],
                },
              ],
              clientGatewayMessageId: 'cgw-id',
            } as SendMessageResponse;
          });

        mockChannelService.getChannelOrThrow = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              type: ChannelType.PUB,
              useAnonymousExtChannel: false,
              payloadEncryption: true,
              messageForms: true,
              fqcn: 'fqcn', // it doesn't matter in that test case if we send full channel, it's not important here
              conditions: {
                qualifiedDids: ['did1'],
                topics: [
                  {
                    topicId: 'topicId',
                  },
                ],
              },
            };
          });

        mockTopicService.getTopic = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              name: 'name',
              id: 'topicId',
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'number',
                  },
                },
              },
              schemaType: SchemaType.JSD7,
              version: '0.0.1',
            };
          });

        try {
          result = await service.sendMessage(messagePayload);
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
        expect(result).not.toBeNull();
      });

      it('should generate random key', () => {
        expect(mockKeysService.generateRandomKey).toBeCalledTimes(1);
      });

      it('should call keys service to encrypt message', () => {
        expect(mockKeysService.encryptMessage).toBeCalledTimes(1);
        expect(mockKeysService.encryptMessage).toBeCalledWith(
          messagePayload.payload,
          'random_key',
          EncryptedMessageType['UTF-8']
        );
      });

      it('should encrypt symmetric keys', () => {
        expect(mockKeysService.encryptSymmetricKey).toBeCalledTimes(1);
        expect(mockKeysService.encryptSymmetricKey).toBeCalledWith(
          'random_key',
          'did1'
        );
      });

      it('should send symmetric keys', () => {
        expect(mockDdhubMessageService.sendMessageInternal).toBeCalledTimes(1);
        expect(mockDdhubMessageService.sendMessageInternal).toBeCalledWith(
          'did1',
          expect.any(String),
          'encrypted-symmetric-key'
        );
      });

      it('should call send message', () => {
        expect(mockDdhubMessageService.sendMessage).toBeCalledWith(
          ['did1'],
          'encrypted-message',
          'topicId',
          '0.0.1',
          'generated-signature',
          expect.any(String),
          true,
          [],
          messagePayload.transactionId,
          undefined,
          undefined
        );
      });

      it('should store message recipient', () => {
        expect(mockMessageStoreService.storeRecipients).toBeCalledTimes(1);
        expect(mockMessageStoreService.storeRecipients).toBeCalledWith(
          'did1',
          'messageId',
          'todo',
          200,
          expect.any(String)
        );
      });

      it('should store sent message', () => {
        expect(mockMessageStoreService.storeSentMessage).toBeCalledTimes(1);
      });

      it('should generate signature', () => {
        expect(mockKeysService.createSignature).toBeCalledTimes(1);
        expect(mockKeysService.createSignature).toBeCalledWith(
          'encrypted-message',
          '0xprivate_key'
        );
      });

      it('should call channel service to obtain channel', () => {
        expect(mockChannelService.getChannelOrThrow).toBeCalledTimes(1);
        expect(mockChannelService.getChannelOrThrow).toBeCalledWith('fqcn');
      });

      it('should call topic service to obtain topic', () => {
        expect(mockTopicService.getTopic).toBeCalledTimes(1);
        expect(mockTopicService.getTopic).toBeCalledWith(
          messagePayload.topicName,
          messagePayload.topicOwner,
          messagePayload.topicVersion
        );
      });
    });

    describe('should not send message as schema is not valid', () => {
      const messagePayload: SendMessageDto = {
        fqcn: 'fqcn',
        payload: 'some-payload',
        topicOwner: 'topicOwner',
        topicName: 'topicName',
        transactionId: 'transactionId',
        topicVersion: '0.0.1',
        anonymousRecipient: [],
      };

      beforeEach(async () => {
        mockChannelService.getChannelOrThrow = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              type: ChannelType.PUB,
              fqcn: 'fqcn', // it doesn't matter in that test case if we send full channel, it's not important here
              conditions: {
                qualifiedDids: ['did1'],
                topics: [
                  {
                    topicId: 'topicId',
                  },
                ],
              },
            };
          });

        mockTopicService.getTopic = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              name: 'name',
              id: 'topicId',
              schema:
                '{\n   "type": "object", "properties" :{ "data":  {  "type": "INVALIDTYPE"\n} }  \n}',
              schemaType: SchemaType.JSD7,
              version: '0.0.1',
            };
          });

        try {
          result = await service.sendMessage(messagePayload);
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(result).toBeNull();
        expect(error).toBeInstanceOf(MalformedJSONException);
      });

      it('should call channel service to obtain channel', () => {
        expect(mockChannelService.getChannelOrThrow).toBeCalledTimes(1);
        expect(mockChannelService.getChannelOrThrow).toBeCalledWith('fqcn');
      });

      it('should call topic service to obtain topic', () => {
        expect(mockTopicService.getTopic).toBeCalledTimes(1);
        expect(mockTopicService.getTopic).toBeCalledWith(
          messagePayload.topicName,
          messagePayload.topicOwner,
          messagePayload.topicVersion
        );
      });
    });

    // It doesn't make sense to send message to 0 recipients
    describe('should not send message as qualified dids equal to 0', () => {
      const messagePayload: SendMessageDto = {
        fqcn: 'fqcn',
        payload: 'some-payload',
        topicOwner: 'topicOwner',
        topicName: 'topicName',
        transactionId: 'transactionId',
        topicVersion: '0.0.1',
        anonymousRecipient: [],
      };

      beforeEach(async () => {
        mockChannelService.getChannelOrThrow = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              fqcn: 'fqcn', // it doesn't matter in that test case if we send full channel, it's not important here
              conditions: {
                qualifiedDids: [],
                topics: [
                  {
                    topicId: 'topicId',
                  },
                ],
              },
            };
          });

        mockTopicService.getTopic = jest
          .fn()
          .mockImplementationOnce(async () => {
            return {
              name: 'name',
              id: 'topicId',
              schema: 'schema',
              schemaType: 'schemaType',
              version: '0.0.1',
            };
          });

        try {
          result = await service.sendMessage(messagePayload);
        } catch (e) {
          error = e;
        }
      });

      it('should not execute', () => {
        expect(result).toBeNull();
        expect(error).toBeInstanceOf(RecipientsNotFoundException);
      });

      it('should call channel service to obtain channel', () => {
        expect(mockChannelService.getChannelOrThrow).toBeCalledTimes(1);
        expect(mockChannelService.getChannelOrThrow).toBeCalledWith('fqcn');
      });

      it('should call topic service to obtain topic', () => {
        expect(mockTopicService.getTopic).toBeCalledTimes(1);
        expect(mockTopicService.getTopic).toBeCalledWith(
          messagePayload.topicName,
          messagePayload.topicOwner,
          messagePayload.topicVersion
        );
      });
    });
  });
});
