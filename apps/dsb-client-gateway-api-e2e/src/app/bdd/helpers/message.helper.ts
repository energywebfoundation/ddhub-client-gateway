import { INestApplication } from '@nestjs/common';
import fs from 'fs';
import { SendMessageDto } from '../../../../../dsb-client-gateway-api/src/app/modules/message/dto/request/send-message.dto';
import request from 'supertest';
import { MemoryHelper } from './memory.helper';
import { v4 as uuidv4 } from 'uuid';

const getMessagePayload = <T = SendMessageDto>(payloadId: string): T => {
  const channelDto: T = JSON.parse(
    fs
      .readFileSync(
        __dirname + '/../../../feature/testResources/message/' + payloadId
      )
      .toString()
  ) as unknown as T;

  return channelDto;
};

export const whenISendMessage = (
  when,
  app: () => INestApplication,
  testMemory: MemoryHelper
) => {
  when(/^I send message with payload (.*)$/, async (payloadId: string) => {
    const payloadToEmit = uuidv4();

    await request(app().getHttpServer())
      .post('/messages/')
      .send({
        ...(getMessagePayload(payloadId) as object),
        payload: JSON.stringify({
          data: payloadToEmit,
        }),
      })
      .expect(({ body, statusCode }) => {
        testMemory.map['SENT_MESSAGE_RESPONSE'] = {
          response: body,
          statusCode,
          payloadToEmit,
        };
      });
  });
};

export const thenMessageResponseShouldContainSuccessfulRecipient = (
  then,
  testMemory: MemoryHelper
) => {
  then('Message response should contain 1 successful recipient', () => {
    expect(
      testMemory.map['SENT_MESSAGE_RESPONSE'].response.recipients.total
    ).toBe(1);
    expect(
      testMemory.map['SENT_MESSAGE_RESPONSE'].response.recipients.sent
    ).toBe(1);
    expect(
      testMemory.map['SENT_MESSAGE_RESPONSE'].response.recipients.failed
    ).toBe(0);
  });
};

export const thenMessageResponseStatusCodeShouldBe = (
  then,
  testMemory: MemoryHelper
) => {
  then(/^Message response status should be (.*)$/, (statusCode: string) => {
    if (testMemory.map['SENT_MESSAGE_RESPONSE'].statusCode !== 200) {
      console.error(testMemory.map['SENT_MESSAGE_RESPONSE'].response);
    }

    expect(testMemory.map['SENT_MESSAGE_RESPONSE'].statusCode).toBe(
      +statusCode
    );
  });
};
