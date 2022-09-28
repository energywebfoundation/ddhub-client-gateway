import {
  ClientsService,
  MaximumNumberOfClientsReachedException,
} from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { ClientEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';

const wrapper = {
  repository: {
    save: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
};

const configService = {
  getConfig: jest.fn(),
};

describe('ClientsService (SPEC)', () => {
  let clientsService: ClientsService;

  beforeEach(async () => {
    clientsService = new ClientsService(wrapper as any, configService as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('upsert', () => {
    it('should directly save entity as client does not exists', async () => {
      const entity = new ClientEntity();

      entity.id = 'ID';
      entity.clientId = 'CLIENT_ID';
      entity.createdDate = new Date();
      entity.updatedDate = new Date();

      wrapper.repository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => entity);

      configService.getConfig = jest.fn().mockImplementationOnce(async () => ({
        msgExpired: 5,
        msgMaxSize: 5,
        fileMaxSize: 5,
        natsMaxClientidSize: 5,
      }));

      await clientsService.upsert(entity.clientId);

      expect(wrapper.repository.findOne).toBeCalledTimes(1);
      expect(wrapper.repository.count).toBeCalledTimes(0);
      expect(configService.getConfig).toBeCalledTimes(0);
      expect(wrapper.repository.update).toBeCalledTimes(1);
    });

    it('should not create new client due to limit', async () => {
      const entity = new ClientEntity();

      entity.id = 'ID';
      entity.clientId = 'CLIENT_ID';
      entity.createdDate = new Date();
      entity.updatedDate = new Date();

      wrapper.repository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => undefined);

      wrapper.repository.count = jest
        .fn()
        .mockImplementationOnce(async () => 4);

      configService.getConfig = jest.fn().mockImplementationOnce(async () => ({
        msgExpired: 5,
        msgMaxSize: 5,
        fileMaxSize: 5,
        natsMaxClientidSize: 5,
      }));

      try {
        await clientsService.upsert(entity.clientId);
      } catch (e) {
        expect(e).toBeInstanceOf(MaximumNumberOfClientsReachedException);

        expect(wrapper.repository.findOne).toBeCalledTimes(1);
        expect(wrapper.repository.count).toBeCalledTimes(1);
        expect(configService.getConfig).toBeCalledTimes(1);
        expect(wrapper.repository.save).toBeCalledTimes(0);
      }
    });

    it('should create new client', async () => {
      const entity = new ClientEntity();

      entity.id = 'ID';
      entity.clientId = 'CLIENT_ID';
      entity.createdDate = new Date();
      entity.updatedDate = new Date();

      wrapper.repository.findOne = jest
        .fn()
        .mockImplementationOnce(async () => undefined);

      wrapper.repository.count = jest
        .fn()
        .mockImplementationOnce(async () => 0);

      configService.getConfig = jest.fn().mockImplementationOnce(async () => ({
        msgExpired: 5,
        msgMaxSize: 5,
        fileMaxSize: 5,
        natsMaxClientidSize: 5,
      }));

      await clientsService.upsert(entity.clientId);

      expect(wrapper.repository.findOne).toBeCalledTimes(1);
      expect(wrapper.repository.count).toBeCalledTimes(1);
      expect(configService.getConfig).toBeCalledTimes(1);
      expect(wrapper.repository.save).toBeCalledTimes(1);
    });
  });
});
