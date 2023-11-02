import { MigrationInterface, QueryRunner } from 'typeorm';

export class convertPayloadToText1694508327852 implements MigrationInterface {
  name = 'convertPayloadToText1694508327852';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.received_messages DROP COLUMN "payload"`
    );
    await queryRunner.query(
      `ALTER TABLE public.received_messages ADD "payload" text NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE public.sent_messages DROP COLUMN "payload"`
    );
    await queryRunner.query(
      `ALTER TABLE public.sent_messages ADD "payload" text NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public.sent_messages DROP COLUMN "payload"`
    );
    await queryRunner.query(
      `ALTER TABLE public.sent_messages ADD "payload" character varying(255)`
    );
    await queryRunner.query(
      `ALTER TABLE public.received_messages DROP COLUMN "payload"`
    );
    await queryRunner.query(
      `ALTER TABLE public.received_messages ADD "payload" character varying(255)`
    );
  }
}
