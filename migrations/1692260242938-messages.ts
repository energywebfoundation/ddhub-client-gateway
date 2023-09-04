import { MigrationInterface, QueryRunner } from 'typeorm';

export class messages1692260242938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.sent_messages ADD COLUMN "initiatingTransactionId" VARCHAR(255);
      ALTER TABLE public.received_messages ADD COLUMN "initiatingTransactionId" VARCHAR(255);

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
