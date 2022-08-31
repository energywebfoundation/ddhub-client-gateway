import { MigrationInterface, QueryRunner } from 'typeorm';

export class initAck1661858287464 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.topic_monitor (
            owner character varying NOT NULL,
            "createdDate" timestamp without time zone DEFAULT now() NOT NULL,
            "updatedDate" timestamp without time zone DEFAULT now() NOT NULL,
            "lastTopicVersionUpdate" timestamp with time zone NOT NULL,
            "lastTopicUpdate" timestamp with time zone NOT NULL
        );

        ALTER TABLE ONLY public.topic_monitor DROP CONSTRAINT IF EXISTS "PK_cf57d6dd8e72a302f9f4770afdc";
        ALTER TABLE ONLY public.topic_monitor ADD CONSTRAINT "PK_cf57d6dd8e72a302f9f4770afdc" PRIMARY KEY (owner);
      `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.acks (
          "messageId" character varying NOT NULL,
          "clientId" character varying NOT NULL,
          "createdDate" timestamp without time zone DEFAULT now() NOT NULL
      );

      ALTER TABLE ONLY public.acks DROP CONSTRAINT IF EXISTS "PK_bdfa112bc4c4d7a97ebd8ad69ef";
      ALTER TABLE ONLY public.acks ADD CONSTRAINT "PK_bdfa112bc4c4d7a97ebd8ad69ef" PRIMARY KEY ("messageId", "clientId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
