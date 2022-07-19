import { MigrationInterface, QueryRunner } from 'typeorm';

export class channelPayloadEncryption1658119708760
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE public.channels ALTER COLUMN "payloadEncryption" DROP NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE public.channels ALTER COLUMN "payloadEncryption" SET NOT NULL'
    );
  }
}
