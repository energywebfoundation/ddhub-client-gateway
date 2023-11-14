import { MigrationInterface, QueryRunner } from 'typeorm';

export class filePath1694508327853 implements MigrationInterface {
  name = 'filePath1694508327853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.sent_messages
        ADD COLUMN "filePath" text DEFAULT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.sent_messages
        DROP COLUMN "filePath"`
    );
  }
}
