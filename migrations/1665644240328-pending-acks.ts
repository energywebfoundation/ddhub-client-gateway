import { MigrationInterface, QueryRunner } from "typeorm";

export class pendingAcks1665644240328 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.acks (
          "messageId" character varying NOT NULL,
          "clientId" character varying NOT NULL,
          "createdDate" timestamp without time zone DEFAULT now() NOT NULL,
          "mbTimestamp" timestamp without time zone
      );

      ALTER TABLE ONLY public.acks DROP CONSTRAINT IF EXISTS "PK_pending_acks";
      ALTER TABLE ONLY public.acks ADD CONSTRAINT "PK_pending_acks" PRIMARY KEY ("messageId", "clientId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
