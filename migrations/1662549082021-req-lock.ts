import { MigrationInterface, QueryRunner } from 'typeorm';

export class reqLock1662549082021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public.req_lock (
            "clientId" character varying NOT NULL,
            fqcn character varying NOT NULL,
            "createdDate" timestamp without time zone DEFAULT now() NOT NULL,
            "updatedDate" timestamp without time zone DEFAULT now() NOT NULL
        );

        ALTER TABLE ONLY public.req_lock ADD CONSTRAINT "PK_5aa9543c8c1aa862d3750987ad8" PRIMARY KEY ("clientId", fqcn);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
