import { MigrationInterface, QueryRunner } from 'typeorm';

export class messages1692260242937 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.topic
          ADD CONSTRAINT "UC_topics_id_version" UNIQUE (id, version);

CREATE TABLE public.received_messages (
    "messageId" VARCHAR(255) PRIMARY KEY,
    "initiatingMessageId" VARCHAR(255),
    "clientGatewayMessageId" VARCHAR(255) NOT NULL,
    "topicId" VARCHAR(255),
    "topicVersion" VARCHAR(255),
    "transactionId" VARCHAR(255),
    signature VARCHAR(255),
    "senderDid" VARCHAR(255),
    "payloadEncryption" BOOLEAN DEFAULT FALSE,
    payload VARCHAR(255),
    "timestampNanos" TIMESTAMP,
    "isFile" BOOLEAN DEFAULT FALSE,
    "createdDate" DATE DEFAULT CURRENT_DATE,
    "updatedDate" DATE DEFAULT CURRENT_DATE
);

CREATE TABLE public.received_messages_mapping (
    fqcn VARCHAR(255) PRIMARY KEY,
    "messageId" VARCHAR(255) REFERENCES public.received_messages("messageId")
);

CREATE TABLE public.received_messages_read_status (
    "messageId" VARCHAR(255) REFERENCES public.received_messages("messageId"),
    "recipientUser" VARCHAR(255),
    PRIMARY KEY ("messageId", "recipientUser")
);

CREATE TABLE public.sent_messages (
    "initiatingMessageId" VARCHAR(255),
    "clientGatewayMessageId" VARCHAR(255) NOT NULL,
    "topicId" VARCHAR(255),
    "topicVersion" VARCHAR(255),
    "transactionId" VARCHAR(255),
    signature VARCHAR(255),
    "payloadEncryption" BOOLEAN DEFAULT FALSE,
    payload VARCHAR(255),
    "timestampNanos" TIMESTAMP,
    "isFile" BOOLEAN DEFAULT FALSE,
    "totalRecipients" NUMERIC,
    "totalSent" NUMERIC,
    "totalFailed" NUMERIC,
    "createdDate" DATE DEFAULT CURRENT_DATE,
    "updatedDate" DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY ("clientGatewayMessageId")
);

CREATE TABLE public.sent_messages_recipients (
    "clientGatewayMessageId" VARCHAR(255),
    "messageId" VARCHAR(255) PRIMARY KEY,
    "recipientDid" VARCHAR(255),
    status VARCHAR(255),
    "statusCode" NUMERIC,
    "createdDate" DATE DEFAULT CURRENT_DATE,
    "updatedDate" DATE DEFAULT CURRENT_DATE
);

        ALTER TABLE public.channels ADD COLUMN "messageForms" boolean DEFAULT false;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
