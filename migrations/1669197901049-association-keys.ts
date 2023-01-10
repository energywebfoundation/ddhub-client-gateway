import { MigrationInterface, QueryRunner } from 'typeorm';

export class associationKeys1669197901049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.association_key (
           "associationKey" character varying NOT NULL,
           "validTo" timestamp without time zone DEFAULT now() NOT NULL,
           "validFrom" timestamp without time zone DEFAULT now() NOT NULL,
           "isSent" boolean NOT NULL,
           "sentDate" timestamp without time zone DEFAULT NULL,
           iteration character varying NOT NULL,
           owner character varying NOT NULL,
           "createdDate" timestamp without time zone DEFAULT now() NOT NULL,
           "updatedDate" timestamp without time zone DEFAULT now() NOT NULL,
           PRIMARY KEY ("associationKey")
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
