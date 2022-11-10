import { MigrationInterface, QueryRunner } from 'typeorm';

export class pendingAcks1665644240328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.pending_acks (
          "messageId" character varying NOT NULL,
          "clientId" character varying NOT NULL,
          "createdDate" timestamp without time zone DEFAULT now() NOT NULL,
          "mbTimestamp" timestamp without time zone,
          PRIMARY KEY ("messageId", "clientId")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
