import { MigrationInterface, QueryRunner } from 'typeorm';

export class associationKeyEmitted1670574336600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table association_key add column "isShared" boolean default false;
        alter table association_key add column "sharedDate" timestamp without time zone DEFAULT NULL;

      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
