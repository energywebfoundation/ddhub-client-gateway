import { MigrationInterface, QueryRunner } from "typeorm";

export class pendingAcksAnonymousRecipient1670402790191 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ONLY public.pending_acks DROP CONSTRAINT IF EXISTS "PK_pending_acks";
      ALTER TABLE IF EXISTS public.pending_acks ADD COLUMN IF NOT EXISTS "anonymousRecipient" character varying default '';
      ALTER TABLE IF EXISTS public.pending_acks ADD CONSTRAINT "PK_pending_acks" PRIMARY KEY ("messageId", "clientId", "from", "anonymousRecipient");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
