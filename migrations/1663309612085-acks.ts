import { MigrationInterface, QueryRunner } from "typeorm";

export class acks1663309612085 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      ALTER TABLE IF EXISTS public.acks
        ADD COLUMN "mbTimestamp" timestamp without time zone;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
