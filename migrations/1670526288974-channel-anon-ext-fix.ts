import { MigrationInterface, QueryRunner } from 'typeorm';

export class channelAnonExtFix1670526288974 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'alter table channels alter column "useAnonymousExtChannel" set default false;'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
