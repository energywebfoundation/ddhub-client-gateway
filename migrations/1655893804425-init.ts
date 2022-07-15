import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1655893804425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "applications" ("appName" varchar PRIMARY KEY NOT NULL, "logoUrl" varchar, "websiteUrl" varchar, "description" varchar, "namespace" varchar, "topicsCount" integer, "roles" text NOT NULL DEFAULT (\'[]\'), "createdDate" datetime NOT NULL DEFAULT (datetime(\'now\')), "updatedDate" datetime NOT NULL DEFAULT (datetime(\'now\')))'
    );

    await queryRunner.query(
      'CREATE TABLE "channels" ("fqcn" varchar PRIMARY KEY NOT NULL, "type" varchar CHECK( "type" IN (\'pub\',\'sub\',\'download\',\'upload\') ) NOT NULL, "conditions" text NOT NULL, "payloadEncryption" boolean NOT NULL DEFAULT (1), "createdDate" datetime NOT NULL DEFAULT (datetime(\'now\')), "updatedDate" datetime NOT NULL DEFAULT (datetime(\'now\')))'
    );
    await queryRunner.query(
      "CREATE TABLE \"cron\" (\"jobName\" varchar CHECK( \"jobName\" IN ('DID_LISTENER','CHANNEL_ROLES','TOPIC_REFRESH','SYMMETRIC_KEYS','PRIVATE_KEY','APPLICATIONS_REFRESH','HEARTBEAT','FILE_CLEANER') ) PRIMARY KEY NOT NULL, \"latestStatus\" varchar CHECK( \"latestStatus\" IN ('SUCCESS','FAILED') ) NOT NULL, \"executedAt\" datetime NOT NULL, \"createdDate\" datetime NOT NULL DEFAULT (datetime('now')), \"updatedDate\" datetime NOT NULL DEFAULT (datetime('now')))"
    );

    await queryRunner.query(
      'CREATE TABLE "dids" ("did" varchar PRIMARY KEY NOT NULL, "publicRSAKey" varchar, "publicSignatureKey" varchar, "createdDate" datetime NOT NULL DEFAULT (datetime(\'now\')), "updatedDate" datetime NOT NULL DEFAULT (datetime(\'now\')))'
    );

    await queryRunner.query(
      'CREATE TABLE "enrolment" ("did" varchar PRIMARY KEY NOT NULL, "roles" text NOT NULL)'
    );

    await queryRunner.query(
      'CREATE TABLE "events" ("eventType" varchar PRIMARY KEY NOT NULL, "workerId" varchar NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime(\'now\')), "updatedDate" datetime NOT NULL DEFAULT (datetime(\'now\')))'
    );

    await queryRunner.query(
      'CREATE TABLE "files" ("fileId" varchar NOT NULL, "did" varchar NOT NULL, "clientGatewayMessageId" varchar NOT NULL, "signature" varchar NOT NULL, "encrypted" boolean NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime(\'now\')), "updatedDate" datetime NOT NULL DEFAULT (datetime(\'now\')), PRIMARY KEY ("fileId", "did", "clientGatewayMessageId", "signature"))'
    );

    await queryRunner.query(
      'CREATE TABLE "identity" ("address" varchar PRIMARY KEY NOT NULL, "publicKey" varchar NOT NULL, "balance" varchar CHECK( "balance" IN (\'NONE\',\'OK\',\'LOW\') ) NOT NULL)'
    );

    await queryRunner.query(
      'CREATE TABLE "symmetric_keys" ("id" varchar PRIMARY KEY NOT NULL, "clientGatewayMessageId" varchar NOT NULL, "payload" varchar NOT NULL, "senderDid" varchar NOT NULL)'
    );

    await queryRunner.query(
      'CREATE TABLE "topic" ("id" varchar NOT NULL, "name" varchar NOT NULL, "schemaType" varchar NOT NULL, "schema" text NOT NULL, "tags" text NOT NULL, "owner" varchar NOT NULL, "version" varchar NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime(\'now\')), "updatedDate" datetime NOT NULL DEFAULT (datetime(\'now\')), "majorVersion" varchar, "minorVersion" varchar, "patchVersion" varchar, PRIMARY KEY ("id", "name", "schemaType", "version"))'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tablesToDrop = [
      'applications',
      'channels',
      'cron',
      'dids',
      'enrolment',
      'events',
      'files',
      'identity',
      'symmetric_keys',
      'topic',
    ];

    for (const table of tablesToDrop) {
      await queryRunner.dropTable(table, true);
    }
  }
}
