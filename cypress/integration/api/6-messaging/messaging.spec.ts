import { faker } from '@faker-js/faker';

describe('Messaging tests', () => {
  it.only('Happy Path - With encryption - No AK', () => {
    const randomNumber = faker.datatype.number({
      min: 1,
      max: 100000,
    });

    const transactionId = faker.datatype.uuid();

    cy.loginAdmin()
      .then(() => cy.setupPrivateKey())
      .then(() => cy.createChannelWithTopic('pub', false, true))
      .then((createChannelResponse) => {
        return cy
          .sendMessage({
            fqcn: createChannelResponse.body.fqcn,
            topicName:
              createChannelResponse.body.conditions.topics[0].topicName,
            topicOwner: createChannelResponse.body.conditions.topics[0].owner,
            topicVersion: '0.0.1', // @TODO - replace topic version from getTopic command
            payload: '{ "data": ' + randomNumber + ' }',
            transactionId,
          })
          .then((sendMessageResponse) => {
            expect(sendMessageResponse.body.clientGatewayMessageId).to.be.a(
              'string'
            );

            expect(sendMessageResponse.body.recipients.total).to.eq(1);
            expect(sendMessageResponse.body.recipients.failed).to.eq(0);
            expect(sendMessageResponse.body.recipients.sent).to.eq(1);

            expect(sendMessageResponse.body.status[0].details[0].did).to.be.a(
              'string'
            );

            expect(
              sendMessageResponse.body.status[0].details[0].messageId
            ).to.be.a('string');

            expect(
              sendMessageResponse.body.status[0].details[0].statusCode
            ).to.eq(200);

            return cy
              .wait(10_000)
              .receiveMessage(createChannelResponse.body.fqcn, {
                topicName:
                  createChannelResponse.body.conditions.topics[0].topicName,
                topicOwner:
                  createChannelResponse.body.conditions.topics[0].owner,
              });
          })
          .then((receiveMessageResponse) => {
            expect(receiveMessageResponse.body.length).to.gte(1);

            const sentMessage = receiveMessageResponse.body.find(
              (receivedMessage) =>
                receivedMessage.transactionId === transactionId
            );

            expect(!!sentMessage).to.eq(true);
          });
      });
  });

  it.only('Happy Path - No Encryption - No AK', () => {
    const randomNumber = faker.datatype.number({
      min: 1,
      max: 100000,
    });

    const transactionId = faker.datatype.uuid();

    cy.loginAdmin()
      .then(() => cy.setupPrivateKey())
      .then(() => cy.createChannelWithTopic('pub', false, false))
      .then((createChannelResponse) => {
        return cy
          .sendMessage({
            fqcn: createChannelResponse.body.fqcn,
            topicName:
              createChannelResponse.body.conditions.topics[0].topicName,
            topicOwner: createChannelResponse.body.conditions.topics[0].owner,
            topicVersion: '0.0.1', // @TODO - replace topic version from getTopic command
            payload: '{ "data": ' + randomNumber + ' }',
            transactionId,
          })
          .then((sendMessageResponse) => {
            expect(sendMessageResponse.body.clientGatewayMessageId).to.be.a(
              'string'
            );

            expect(sendMessageResponse.body.recipients.total).to.eq(1);
            expect(sendMessageResponse.body.recipients.failed).to.eq(0);
            expect(sendMessageResponse.body.recipients.sent).to.eq(1);

            expect(sendMessageResponse.body.status[0].details[0].did).to.be.a(
              'string'
            );

            expect(
              sendMessageResponse.body.status[0].details[0].messageId
            ).to.be.a('string');

            expect(
              sendMessageResponse.body.status[0].details[0].statusCode
            ).to.eq(200);

            return cy
              .wait(10_000)
              .receiveMessage(createChannelResponse.body.fqcn, {
                topicName:
                  createChannelResponse.body.conditions.topics[0].topicName,
                topicOwner:
                  createChannelResponse.body.conditions.topics[0].owner,
              });
          })
          .then((receiveMessageResponse) => {
            expect(receiveMessageResponse.body.length).to.gte(1);

            const sentMessage = receiveMessageResponse.body.find(
              (receivedMessage) =>
                receivedMessage.transactionId === transactionId
            );

            expect(!!sentMessage).to.eq(true);
          });
      });
  });
});
