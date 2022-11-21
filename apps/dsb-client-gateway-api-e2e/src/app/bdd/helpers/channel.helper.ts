import { ChannelWrapperRepository } from '@dsb-client-gateway/dsb-client-gateway-storage';
import fs from 'fs';
import { CreateChannelDto } from '../../../../../dsb-client-gateway-api/src/app/modules/channel/dto/request/create-channel.dto';
import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UpdateChannelDto } from '../../../../../dsb-client-gateway-api/src/app/modules/channel/dto/request/update-channel.dto';
import { MEM_TYPE, MemoryHelper } from './memory.helper';

const getChannelPayload = <T = CreateChannelDto>(payloadId: string): T => {
  const channelDto: T = JSON.parse(
    fs
      .readFileSync(
        __dirname + '/../../../feature/testResources/channel/' + payloadId
      )
      .toString()
  ) as unknown as T;

  return channelDto;
};

export const givenIHaveEmptyListOfChannels = (
  given,
  app: () => INestApplication
) => {
  given('No channels exists', async () => {
    await app().get(ChannelWrapperRepository).channelRepository.clear();
  });
};

export const thenPayloadEncryptionShouldBeUpdated = (
  then,
  app: () => INestApplication
) => {
  then(
    /^The channel with (.*) should have payload encryption set to (.*)$/,
    async (fqcn: string, payloadEncryption: string) => {
      await request(app().getHttpServer())
        .get('/channels/' + fqcn)
        .expect(({ body }) => {
          expect(body.fqcn).toEqual(fqcn);
          expect(body.payloadEncryption).toEqual(payloadEncryption === 'true');
        })
        .expect(HttpStatus.OK);
    }
  );
};

export const thenIShouldReceiveChannelEntity = (
  then,
  app: () => INestApplication
) => {
  then(
    /^The channel with (.*) should be visible in list of channels$/,
    async (payloadId: string) => {
      await request(app().getHttpServer())
        .get('/channels')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          console.log(body);
        });
    }
  );
};

export const whenISendDeleteRequest = (
  when,
  app: () => INestApplication,
  memory: MemoryHelper
) => {
  when(/^I send a delete request with (.*)$/, async (payloadId: string) => {
    const channelDto: CreateChannelDto = getChannelPayload(payloadId);

    memory.map[MEM_TYPE.CHANNEL_DELETE_RESPONSE] = await request(
      app().getHttpServer()
    ).delete('/channels/' + channelDto.fqcn);
  });
};

export const thenIShouldNotReceiveChannelEntity = (
  then,
  app: () => INestApplication
) => {
  then(
    /^The channel with (.*) should not be visible in list of channels$/,
    async (payloadId: string) => {
      const channelDto: CreateChannelDto = getChannelPayload(payloadId);

      await request(app().getHttpServer())
        .get('/channels')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          if (body.length > 0) {
            for (const channel of body) {
              expect(channel.fqcn).not.toBe(channelDto.fqcn);
            }
          }
        });
    }
  );
};

export const thenChannelShouldHaveQualifiedDids = (
  then,
  app: () => INestApplication
) => {
  then(
    /^The channel with (.*) should return qualified dids$/,
    async (payloadId: string) => {
      const channelDto: CreateChannelDto =
        getChannelPayload<CreateChannelDto>(payloadId);

      await request(app().getHttpServer())
        .get('/channels/' + channelDto.fqcn + '/qualifiedDids')
        .expect(({ body }) => {
          expect(body.fqcn).toBe(channelDto.fqcn);
          expect(body.qualifiedDids.length).toBeGreaterThanOrEqual(1);
        });
    }
  );
};

export const whenIUpdatePayloadEncryption = (
  when,
  app: () => INestApplication
) => {
  when(
    /^I send update request with (.*) and fqcn (.*)$/,
    async (payloadId: string, fqcn: string) => {
      const channelDto: UpdateChannelDto =
        getChannelPayload<UpdateChannelDto>(payloadId);

      const response = await request(app().getHttpServer())
        .put('/channels/' + fqcn)
        .send(channelDto)
        .expect(({ body }) => {
          expect(body.fqcn).toBe(fqcn);
          expect(body.type).toBe(channelDto.type);

          expect(body.payloadEncryption).toBe(channelDto.payloadEncryption);

          expect(body.conditions.qualifiedDids.length).toBeGreaterThanOrEqual(
            1
          );
          expect(body.conditions.dids.length).toBe(1);
          expect(body.conditions.qualifiedDids).toContain(
            channelDto.conditions.dids[0]
          );
          expect(body.conditions.dids).toStrictEqual(
            channelDto.conditions.dids
          );
        })
        .expect(HttpStatus.OK);

      return response;
    }
  );
};

export const givenICreatedChannel = (
  given,
  app: () => INestApplication,
  memory: MemoryHelper
) => {
  given(/^Channel is created with (.*)$/, async (payloadId: string) => {
    const channelDto: CreateChannelDto = getChannelPayload(payloadId);

    memory.map[MEM_TYPE.CHANNEL_CREATE_RESPONSE] = await request(
      app().getHttpServer()
    )
      .post('/channels')
      .send(channelDto);
  });
};

export const whenICreateChannel = (
  when,
  app: () => INestApplication,
  memory: MemoryHelper
) => {
  when(/^I send a request with (.*)$/, async (payloadId: string) => {
    const channelDto: CreateChannelDto = getChannelPayload(payloadId);

    // .expect(({ body }) => {
    //   console.log(body);
    //   expect(body.fqcn).toBe(channelDto.fqcn);
    //   expect(body.type).toBe(channelDto.type);
    //
    //   expect(body.payloadEncryption).toBe(channelDto.payloadEncryption);
    //
    //   expect(body.conditions.qualifiedDids.length).toBeGreaterThanOrEqual(1);
    // })
    // .expect(HttpStatus.CREATED);

    memory.map[MEM_TYPE.CHANNEL_CREATE_RESPONSE] = await request(
      app().getHttpServer()
    )
      .post('/channels')
      .send(channelDto);
  });
};
