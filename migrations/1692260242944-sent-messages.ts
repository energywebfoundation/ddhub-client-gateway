import { MigrationInterface, QueryRunner } from 'typeorm';

export class messages1692260242944 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.sent_messages ADD COLUMN "messageIds" text[];
      ALTER TABLE public.sent_messages ADD COLUMN "topicOwner" VARCHAR(255);
      ALTER TABLE public.sent_messages ADD COLUMN "topicName" VARCHAR(255);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
