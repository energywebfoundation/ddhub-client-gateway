import { Test } from '@nestjs/testing';
import { KeysService } from '../../keys/service/keys.service';
import {
  AddressBookRepositoryWrapper,
  ReceivedMessageReadStatusRepositoryWrapper,
  ReceivedMessageRepositoryWrapper,
  SentMessageRecipientRepositoryWrapper,
  SentMessageRepositoryWrapper,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { OfflineMessagesService } from './offline-messages.service';
import { GetReceivedMessageResponseDto } from '../dto/response/get-received-message-response.dto';
import { SelectQueryBuilder } from 'typeorm';
import { ModuleMocker } from 'jest-mock';
import { GetSentMessageResponseDto } from '../dto/response/get-sent-message-response.dto';
import { IamService } from '@dsb-client-gateway/dsb-client-gateway-iam-client';

const mockKeysService = {
  generateRandomKey: jest.fn(),
  encryptMessage: jest.fn(),
  encryptSymmetricKey: jest.fn(),
  decryptMessage: jest.fn(),
  verifySignature: jest.fn(),
  createSignature: jest.fn(),
  prefetchSignatureKeys: jest.fn(),
};

const mockIamService = {
  isInitialized: jest.fn(),
  getDIDAddress: jest.fn(),
};

function createMockInstance(cl: any) {
  const mocker = new ModuleMocker(global);
  const Mock = mocker.generateFromMetadata(mocker.getMetadata(cl));
  return new Mock();
}

const queryBuilder = createMockInstance(SelectQueryBuilder);
queryBuilder.where.mockReturnThis();
queryBuilder.andWhere.mockReturnThis();
queryBuilder.orWhere.mockReturnThis();
queryBuilder.orderBy.mockReturnThis();
queryBuilder.take.mockReturnThis();
queryBuilder.skip.mockReturnThis();
queryBuilder.clone.mockReturnValue(queryBuilder);
queryBuilder.connection = {
  createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
};

const receivedMessageRepositoryWrapper = {
  repository: {
    find: jest.fn(),
    getMany: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  },
};
const sentMessagesRepositoryWrapper = {
  repository: {
    find: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    query: jest.fn(),
  },
};
const sentMessagesRecipientsWrapper = {
  repository: {
    find: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  },
};
const receivedMessageReadStatusRepositoryWrapper = {
  repository: {
    find: jest.fn(),
    findByIds: jest.fn(),
    getOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  },
};
const addressBookRepositoryWrapper = {
  repository: {
    find: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  },
};

describe(`${OfflineMessagesService.name}`, () => {
  let service: OfflineMessagesService;

  beforeEach(async () => {
    const queryBuilder = createMockInstance(SelectQueryBuilder);
    queryBuilder.where.mockReturnThis();
    queryBuilder.andWhere.mockReturnThis();
    queryBuilder.orderBy.mockReturnThis();
    queryBuilder.take.mockReturnThis();
    queryBuilder.clone.mockReturnValue(queryBuilder);
    queryBuilder.connection = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    receivedMessageRepositoryWrapper.repository.createQueryBuilder.mockImplementation(
      () => queryBuilder
    );
    sentMessagesRepositoryWrapper.repository.createQueryBuilder.mockImplementation(
      () => queryBuilder
    );
    sentMessagesRecipientsWrapper.repository.createQueryBuilder.mockImplementation(
      () => queryBuilder
    );
    receivedMessageReadStatusRepositoryWrapper.repository.createQueryBuilder.mockImplementation(
      () => queryBuilder
    );
    addressBookRepositoryWrapper.repository.createQueryBuilder.mockImplementation(
      () => queryBuilder
    );

    const module = await Test.createTestingModule({
      providers: [
        OfflineMessagesService,
        {
          provide: ReceivedMessageRepositoryWrapper,
          useValue: receivedMessageRepositoryWrapper,
        },
        {
          provide: SentMessageRepositoryWrapper,
          useValue: sentMessagesRepositoryWrapper,
        },
        {
          provide: SentMessageRecipientRepositoryWrapper,
          useValue: sentMessagesRecipientsWrapper,
        },
        {
          provide: ReceivedMessageReadStatusRepositoryWrapper,
          useValue: receivedMessageReadStatusRepositoryWrapper,
        },
        {
          provide: AddressBookRepositoryWrapper,
          useValue: addressBookRepositoryWrapper,
        },
        {
          provide: KeysService,
          useValue: mockKeysService,
        },
        {
          provide: IamService,
          useValue: mockIamService,
        },
      ],
    }).compile();

    service = module.get<OfflineMessagesService>(OfflineMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeInstanceOf(OfflineMessagesService);
  });

  describe('getOfflineReceivedMessages()', () => {
    let error: Error | null;
    let result: GetReceivedMessageResponseDto[] | null;

    beforeEach(() => {
      jest.resetAllMocks();

      result = null;
      error = null;
    });

    describe('should return an unread received message with no related messages', () => {
      beforeEach(async () => {
        receivedMessageRepositoryWrapper.repository.createQueryBuilder = jest
          .fn()
          .mockImplementationOnce(() => ({
            ...queryBuilder,
            getMany: jest.fn().mockResolvedValueOnce([
              {
                messageId: 'messageId',
                initiatingMessageId: 'initiatingMessageId',
                initiatingTransactionId: 'initiatingTransactionId',
                clientGatewayMessageId: 'clientGatewayMessageId',
                topicId: 'topicId',
                fqcn: 'fqcn',
                topicName: 'topicName',
                topicOwner: 'topicOwner',
                topicVersion: 'topicVersion',
                transactionId: 'transactionId',
                signature: 'signature',
                senderDid: 'senderDid',
                payloadEncryption: false,
                payload: 'payload',
                timestampNanos: new Date(),
                isFile: false,
                createdDate: new Date(),
                updatedDate: new Date(),
              },
            ]),
          }))
          .mockImplementationOnce(() => ({
            ...queryBuilder,
            getMany: jest.fn().mockResolvedValueOnce([]),
          }));

        mockKeysService.prefetchSignatureKeys.mockResolvedValue({
          senderDid: 'senderDid',
        });
        mockKeysService.verifySignature.mockResolvedValue(true);

        addressBookRepositoryWrapper.repository.find.mockResolvedValueOnce([
          {
            did: 'senderDid',
            name: 'name',
            createdDate: new Date(),
            updatedDate: new Date(),
          },
        ]);

        receivedMessageReadStatusRepositoryWrapper.repository.createQueryBuilder =
          jest.fn().mockImplementation(() => ({
            ...queryBuilder,
            getOne: jest.fn().mockResolvedValueOnce(null),
          }));

        sentMessagesRepositoryWrapper.repository.query = jest
          .fn()
          .mockResolvedValueOnce([{ count: 0 }]);

        try {
          result = await service.getOfflineReceivedMessages({
            fqcn: 'fqcn',
          });
        } catch (e) {
          error = e;
        }
      });

      it('should execute function successfully', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should return 1 received message', () => {
        expect(result.length).toStrictEqual(1);
      });

      it('should return isRead false', () => {
        expect(result[0].isRead).toStrictEqual(false);
      });

      it('should have no related messages', () => {
        expect(result[0].relatedMessagesCount).toStrictEqual(0);
      });

      it('should have a senderAlias', () => {
        expect(result[0].senderAlias).toStrictEqual('name');
      });
    });

    describe('should return a read received message with related message count', () => {
      beforeEach(async () => {
        receivedMessageRepositoryWrapper.repository.createQueryBuilder = jest
          .fn()
          .mockImplementationOnce(() => ({
            ...queryBuilder,
            getMany: jest.fn().mockResolvedValueOnce([
              {
                messageId: 'messageId',
                initiatingMessageId: 'initiatingMessageId',
                initiatingTransactionId: 'initiatingTransactionId',
                clientGatewayMessageId: 'clientGatewayMessageId',
                topicId: 'topicId',
                fqcn: 'fqcn',
                topicName: 'topicName',
                topicOwner: 'topicOwner',
                topicVersion: 'topicVersion',
                transactionId: 'transactionId',
                signature: 'signature',
                senderDid: 'senderDid',
                payloadEncryption: false,
                payload: 'payload',
                timestampNanos: new Date(),
                isFile: false,
                createdDate: new Date(),
                updatedDate: new Date(),
              },
            ]),
          }))
          .mockImplementationOnce(() => ({
            ...queryBuilder,
            getMany: jest.fn().mockResolvedValueOnce([
              {
                messageId: 'relatedMessageId',
                initiatingMessageId: 'initiatingMessageId',
                initiatingTransactionId: 'initiatingTransactionId',
                clientGatewayMessageId: 'clientGatewayMessageId',
                topicId: 'topicId',
                fqcn: 'fqcn',
                topicName: 'topicName',
                topicOwner: 'topicOwner',
                topicVersion: 'topicVersion',
                transactionId: 'transactionId',
                signature: 'signature',
                senderDid: 'senderDid',
                payloadEncryption: false,
                payload: 'payload',
                timestampNanos: new Date(),
                isFile: false,
                createdDate: new Date(),
                updatedDate: new Date(),
              },
            ]),
          }));

        mockKeysService.prefetchSignatureKeys.mockResolvedValue({
          senderDid: 'senderDid',
        });
        mockKeysService.verifySignature.mockResolvedValue(true);

        addressBookRepositoryWrapper.repository.find.mockResolvedValueOnce([
          {
            did: 'senderDid',
            name: 'name',
            createdDate: new Date(),
            updatedDate: new Date(),
          },
        ]);

        receivedMessageReadStatusRepositoryWrapper.repository.createQueryBuilder =
          jest.fn().mockImplementation(() => ({
            ...queryBuilder,
            getOne: jest.fn().mockResolvedValueOnce({
              messageId: 'messageId',
              recipientUser: 'recipientUser',
            }),
          }));

        sentMessagesRepositoryWrapper.repository.query = jest
          .fn()
          .mockResolvedValueOnce([{ count: 1 }]);

        try {
          result = await service.getOfflineReceivedMessages({
            fqcn: 'fqcn',
          });
        } catch (e) {
          error = e;
        }
      });

      it('should execute function successfully', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should return 1 received message', () => {
        expect(result.length).toStrictEqual(1);
      });

      it('should return isRead true', () => {
        expect(result[0].isRead).toStrictEqual(true);
      });

      it('should return have related message count and reply message count', () => {
        expect(result[0].replyMessagesCount).toStrictEqual(1);
        expect(result[0].relatedMessagesCount).toStrictEqual(1);
      });
    });
  });

  describe('getOfflineSentMessages()', () => {
    let error: Error | null;
    let result: GetSentMessageResponseDto[] | null;

    beforeEach(() => {
      jest.resetAllMocks();

      result = null;
      error = null;
    });

    describe('should return offline sent messages', () => {
      beforeEach(async () => {
        sentMessagesRepositoryWrapper.repository.createQueryBuilder = jest
          .fn()
          .mockImplementation(() => ({
            ...queryBuilder,
            getMany: jest.fn().mockResolvedValueOnce([
              {
                clientGatewayMessageId: 'clientGatewayMessageId',
                initiatingMessageId: 'initiatingMessageId',
                messageIds: ['messageId'],
                initiatingTransactionId: 'initiatingTransactionId',
                fqcn: 'fqcn',
                topicId: 'topicId',
                topicName: 'topicName',
                topicOwner: 'topicOwner',
                topicVersion: 'topicVersion',
                transactionId: 'transactionId',
                signature: 'signature',
                senderDid: 'senderDid',
                payloadEncryption: false,
                payload: 'payload',
                timestampNanos: new Date(),
                isFile: false,
                filePath: null,
                totalRecipients: 1,
                totalSent: 1,
                totalFailed: 0,
                createdDate: new Date(),
                updatedDate: new Date(),
              },
            ]),
          }));

        receivedMessageRepositoryWrapper.repository.createQueryBuilder = jest
          .fn()
          .mockImplementation(() => ({
            ...queryBuilder,
            getCount: jest.fn().mockResolvedValue(1),
          }));

        addressBookRepositoryWrapper.repository.find.mockResolvedValueOnce([
          {
            did: 'recipientDid',
            name: 'name',
            createdDate: new Date(),
            updatedDate: new Date(),
          },
        ]);

        sentMessagesRecipientsWrapper.repository.find.mockResolvedValueOnce([
          {
            messageId: 'messageId',
            recipientDid: 'recipientDid',
            status: 'status',
            clientGatewayMessageId: 'clientGatewayMessageId',
            statusCode: 200,
            createdDate: new Date(),
            updatedDate: new Date(),
          },
        ]);

        try {
          result = await service.getOfflineSentMessages({
            fqcn: 'fqcn',
            topicName: 'topicName',
            topicOwner: 'topicOwner',
            limit: 1,
            initiatingMessageId: 'initiatingMessageId',
            initiatingTransactionId: 'initiatingTransactionId',
            transactionId: 'transactionId',
            messageId: 'messageId',
            page: 1,
            clientGatewayMessageId: '',
          });
        } catch (e) {
          error = e;
        }
      });

      it('should execute function successfully', () => {
        expect(error).toBeNull();
        expect(result).toBeDefined();
      });

      it('should return 1 message', () => {
        expect(result.length).toStrictEqual(1);
      });

      it('should have one recipient', () => {
        expect(result[0].recipients.length).toStrictEqual(1);
      });

      it('should apply an alias to the recipient', () => {
        expect(result[0].recipients[0]?.alias).toStrictEqual('name');
      });

      it('should have related messages', () => {
        expect(result[0].relatedMessagesCount).toStrictEqual(1);
      });
    });
  });

  describe('ackMessages()', () => {
    let error: Error | null;
    let result: void | null;

    beforeEach(() => {
      jest.resetAllMocks();

      result = null;
      error = null;
    });

    describe('should ack messages', () => {
      beforeEach(async () => {
        receivedMessageReadStatusRepositoryWrapper.repository.findByIds.mockResolvedValueOnce(
          [
            {
              messageId: 'messageId',
              recipientUser: 'recipientUser',
            },
          ]
        );

        receivedMessageReadStatusRepositoryWrapper.repository.save.mockImplementationOnce(
          () => null
        );

        try {
          result = await service.ackMessages('recipientUser', ['messageId2']);
        } catch (e) {
          error = e;
        }
      });

      it('should execute function successfully', () => {
        expect(error).toBeNull();
        expect(result).not.toBeDefined();
        expect(
          receivedMessageReadStatusRepositoryWrapper.repository.save
        ).toBeCalledTimes(1);
      });
    });

    describe('should ack messages with did if no username provided', () => {
      beforeEach(async () => {
        receivedMessageReadStatusRepositoryWrapper.repository.findByIds.mockResolvedValueOnce(
          [
            {
              messageId: 'messageId',
              recipientUser: 'recipientUser',
            },
          ]
        );

        receivedMessageReadStatusRepositoryWrapper.repository.save.mockImplementationOnce(
          () => null
        );

        mockIamService.getDIDAddress.mockReturnValueOnce('did');

        try {
          result = await service.ackMessages(null, ['messageId2']);
        } catch (e) {
          error = e;
        }
      });

      it('should execute function successfully', () => {
        expect(error).toBeNull();
        expect(result).not.toBeDefined();
        expect(
          receivedMessageReadStatusRepositoryWrapper.repository.save
        ).toBeCalledTimes(1);
      });
    });

    describe('should not ack read messages', () => {
      beforeEach(async () => {
        receivedMessageReadStatusRepositoryWrapper.repository.findByIds.mockResolvedValueOnce(
          [
            {
              messageId: 'messageId',
              recipientUser: 'recipientUser',
            },
          ]
        );

        try {
          result = await service.ackMessages('recipientUser', ['messageId']);
        } catch (e) {
          error = e;
        }
      });

      it('should execute function successfully', () => {
        expect(error).toBeNull();
        expect(result).not.toBeDefined();
        expect(
          receivedMessageReadStatusRepositoryWrapper.repository.save
        ).toBeCalledTimes(0);
      });
    });
  });
});
