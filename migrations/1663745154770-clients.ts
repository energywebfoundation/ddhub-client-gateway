import { MigrationInterface, QueryRunner } from 'typeorm';

export class clients1663745154770 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public.clients (
            id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
            "createdDate" timestamp without time zone DEFAULT now() NOT NULL,
            "updatedDate" timestamp without time zone DEFAULT now() NOT NULL,
            "clientId" character varying NOT NULL
        );

        ALTER TABLE ONLY public.clients ADD CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY (id);

        ALTER TABLE ONLY public.clients ADD CONSTRAINT "UQ_c8526f623c0beed53b60cb31bf5" UNIQUE ("clientId");
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
