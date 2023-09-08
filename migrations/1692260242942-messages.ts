import { MigrationInterface, QueryRunner } from 'typeorm';

export class messages1692260242942 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.sent_messages ADD COLUMN "senderDid" VARCHAR(255);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
