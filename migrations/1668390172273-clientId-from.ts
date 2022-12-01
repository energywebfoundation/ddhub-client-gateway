import { MigrationInterface, QueryRunner } from "typeorm";

export class clientIdFrom1668390172273 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ONLY public.pending_acks DROP CONSTRAINT IF EXISTS "PK_pending_acks";
      ALTER TABLE IF EXISTS public.pending_acks ADD COLUMN IF NOT EXISTS "from" character varying default '';
      ALTER TABLE IF EXISTS public.pending_acks ADD CONSTRAINT "PK_pending_acks" PRIMARY KEY ("messageId", "clientId", "from");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
