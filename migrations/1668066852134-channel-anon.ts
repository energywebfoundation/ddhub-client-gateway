import { MigrationInterface, QueryRunner } from 'typeorm';

export class channelAnon1668066852134 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.channels ADD COLUMN IF NOT EXISTS "useAnonymousExtChannel" boolean DEFAULT false NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
