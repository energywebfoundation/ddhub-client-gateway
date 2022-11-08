import { MigrationInterface, QueryRunner } from 'typeorm';

export class createdColumn1663174978806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public.symmetric_keys ADD COLUMN "createdDate" timestamp without time zone DEFAULT now() NOT NULL;
        ALTER TABLE public.symmetric_keys ADD COLUMN "updatedDate" timestamp without time zone DEFAULT now() NOT NULL;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
