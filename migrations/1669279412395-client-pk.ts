import { MigrationInterface, QueryRunner } from 'typeorm';

export class clientPk1669279412394 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS "UQ_c8526f623c0beed53b60cb31bf5" CASCADE;
      ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS "PK_f1ab7cf3a5714dbc6bb4e1c28a4" CASCADE;
      ALTER TABLE public.clients DROP COLUMN IF EXISTS "id";
      ALTER TABLE IF EXISTS public.clients ADD CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("clientId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
