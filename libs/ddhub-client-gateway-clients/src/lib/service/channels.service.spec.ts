import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from './channels.service';
import {
  ChannelEntity,
  ChannelWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';

const mockChannelWrapperRepository = {
  channelRepository: {
    findOne: jest.fn(),
  },
};

describe('ChannelService', () => {
  let channelService: ChannelService;
  let error: Error | null;
  let result: unknown | null;

  beforeEach(async () => {
    jest.resetAllMocks();

    error = null;
    result = null;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: ChannelWrapperRepository,
          useValue: mockChannelWrapperRepository,
        },
      ],
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
  });

  it('should be defined', () => {
    expect(channelService).toBeDefined();
  });

  describe('getChannel()', () => {
    describe('should return channel when found', () => {
      beforeEach(async () => {
        const mockChannel: ChannelEntity = {
          fqcn: 'test.fqcn',
          createdDate: new Date(),
          updatedDate: new Date(),
        } as ChannelEntity;

        mockChannelWrapperRepository.channelRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => mockChannel);

        try {
          result = await channelService.getChannel('test.fqcn');
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should return channel', () => {
        expect(result).toBeDefined();
        expect((result as ChannelEntity).fqcn).toBe('test.fqcn');
      });

      it('should call repository with correct parameters', () => {
        expect(mockChannelWrapperRepository.channelRepository.findOne).toBeCalledTimes(1);
        expect(mockChannelWrapperRepository.channelRepository.findOne).toBeCalledWith({
          where: {
            fqcn: 'test.fqcn',
          },
        });
      });
    });

    describe('should return null when channel not found', () => {
      beforeEach(async () => {
        mockChannelWrapperRepository.channelRepository.findOne = jest
          .fn()
          .mockImplementationOnce(async () => null);

        try {
          result = await channelService.getChannel('non.existent.fqcn');
        } catch (e) {
          error = e;
        }
      });

      it('should execute without error', () => {
        expect(error).toBeNull();
      });

      it('should return null', () => {
        expect(result).toBeNull();
      });

      it('should call repository with correct parameters', () => {
        expect(mockChannelWrapperRepository.channelRepository.findOne).toBeCalledTimes(1);
        expect(mockChannelWrapperRepository.channelRepository.findOne).toBeCalledWith({
          where: {
            fqcn: 'non.existent.fqcn',
          },
        });
      });
    });
  });
}); 