import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1655893804425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      '--\n' +
        '-- PostgreSQL database dump\n' +
        '--\n' +
        '\n' +
        '-- Dumped from database version 14.1\n' +
        '-- Dumped by pg_dump version 14.4 (Ubuntu 14.4-1.pgdg20.04+1)\n' +
        '\n' +
        'SET statement_timeout = 0;\n' +
        'SET lock_timeout = 0;\n' +
        'SET idle_in_transaction_session_timeout = 0;\n' +
        "SET client_encoding = 'UTF8';\n" +
        'SET standard_conforming_strings = on;\n' +
        "SELECT pg_catalog.set_config('search_path', '', false);\n" +
        'SET check_function_bodies = false;\n' +
        'SET xmloption = content;\n' +
        'SET client_min_messages = warning;\n' +
        'SET row_security = off;\n' +
        '\n' +
        '--\n' +
        '-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -\n' +
        '--\n' +
        '\n' +
        'COMMENT ON EXTENSION "uuid-ossp" IS \'generate universally unique identifiers (UUIDs)\';\n' +
        '\n' +
        '\n' +
        "SET default_tablespace = '';\n" +
        '\n' +
        'SET default_table_access_method = heap;\n' +
        '\n' +
        '--\n' +
        '-- Name: applications; Type: TABLE; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE TABLE public.applications (\n' +
        '    "appName" character varying NOT NULL,\n' +
        '    "logoUrl" character varying,\n' +
        '    "websiteUrl" character varying,\n' +
        '    description character varying,\n' +
        '    namespace character varying,\n' +
        '    "topicsCount" integer,\n' +
        "    roles text DEFAULT '[]'::text NOT NULL,\n" +
        '    "createdDate" timestamp without time zone DEFAULT now() NOT NULL,\n' +
        '    "updatedDate" timestamp without time zone DEFAULT now() NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: channels; Type: TABLE; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE TABLE public.channels (\n' +
        '    fqcn character varying NOT NULL,\n' +
        '    type text NOT NULL,\n' +
        '    conditions text NOT NULL,\n' +
        '    "payloadEncryption" boolean DEFAULT true NOT NULL,\n' +
        '    "createdDate" timestamp without time zone DEFAULT now() NOT NULL,\n' +
        '    "updatedDate" timestamp without time zone DEFAULT now() NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: cron; Type: TABLE; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE TABLE public.cron (\n' +
        '    "jobName" text NOT NULL,\n' +
        '    "latestStatus" text NOT NULL,\n' +
        '    "executedAt" timestamp without time zone NOT NULL,\n' +
        '    "createdDate" timestamp without time zone DEFAULT now() NOT NULL,\n' +
        '    "updatedDate" timestamp without time zone DEFAULT now() NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: dids; Type: TABLE; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE TABLE public.dids (\n' +
        '    did character varying NOT NULL,\n' +
        '    "publicRSAKey" character varying,\n' +
        '    "publicSignatureKey" character varying,\n' +
        '    "createdDate" timestamp without time zone DEFAULT now() NOT NULL,\n' +
        '    "updatedDate" timestamp without time zone DEFAULT now() NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: enrolment; Type: TABLE; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE TABLE public.enrolment (\n' +
        '    did character varying NOT NULL,\n' +
        '    roles text NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: events; Type: TABLE; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE TABLE public.events (\n' +
        '    "eventType" character varying NOT NULL,\n' +
        '    "workerId" character varying NOT NULL,\n' +
        '    "createdDate" timestamp without time zone DEFAULT now() NOT NULL,\n' +
        '    "updatedDate" timestamp without time zone DEFAULT now() NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: files; Type: TABLE; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE TABLE public.files (\n' +
        '    "fileId" character varying NOT NULL,\n' +
        '    did character varying NOT NULL,\n' +
        '    "clientGatewayMessageId" character varying NOT NULL,\n' +
        '    signature character varying NOT NULL,\n' +
        '    encrypted boolean NOT NULL,\n' +
        '    "createdDate" timestamp without time zone DEFAULT now() NOT NULL,\n' +
        '    "updatedDate" timestamp without time zone DEFAULT now() NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: identity; Type: TABLE; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE TABLE public.identity (\n' +
        '    address character varying NOT NULL,\n' +
        '    "publicKey" character varying NOT NULL,\n' +
        '    balance text NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        'CREATE TABLE public.symmetric_keys (\n' +
        '    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,\n' +
        '    "clientGatewayMessageId" character varying NOT NULL,\n' +
        '    payload character varying NOT NULL,\n' +
        '    "senderDid" character varying NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: topic; Type: TABLE; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'CREATE TABLE public.topic (\n' +
        '    id character varying NOT NULL,\n' +
        '    name character varying NOT NULL,\n' +
        '    "schemaType" character varying NOT NULL,\n' +
        '    schema text NOT NULL,\n' +
        '    tags text NOT NULL,\n' +
        '    owner character varying NOT NULL,\n' +
        '    "majorVersion" character varying,\n' +
        '    "minorVersion" character varying,\n' +
        '    "patchVersion" character varying,\n' +
        '    version character varying NOT NULL,\n' +
        '    "createdDate" timestamp without time zone DEFAULT now() NOT NULL,\n' +
        '    "updatedDate" timestamp without time zone DEFAULT now() NOT NULL\n' +
        ');\n' +
        '\n' +
        '\n' +
        '--\n' +
        '--\n' +
        '\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: files PK_1179e2352b2958dbbeb9d0beb64; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.files\n' +
        '    ADD CONSTRAINT "PK_1179e2352b2958dbbeb9d0beb64" PRIMARY KEY ("fileId", did, "clientGatewayMessageId", signature);\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: cron PK_16202414b0bd7ffb1b8587e8a1c; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.cron\n' +
        '    ADD CONSTRAINT "PK_16202414b0bd7ffb1b8587e8a1c" PRIMARY KEY ("jobName");\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: applications PK_4449bcd12d59ea5fc46b986b66a; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.applications\n' +
        '    ADD CONSTRAINT "PK_4449bcd12d59ea5fc46b986b66a" PRIMARY KEY ("appName");\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: topic PK_4bef2be9b01f24c8b13b95c7c86; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.topic\n' +
        '    ADD CONSTRAINT "PK_4bef2be9b01f24c8b13b95c7c86" PRIMARY KEY (id, name, "schemaType", version);\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: channels PK_51bc8efb4bb4d9b3ef77a4bdebc; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.channels\n' +
        '    ADD CONSTRAINT "PK_51bc8efb4bb4d9b3ef77a4bdebc" PRIMARY KEY (fqcn);\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: events PK_8295642fc842a7e1b03d54eccc0; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.events\n' +
        '    ADD CONSTRAINT "PK_8295642fc842a7e1b03d54eccc0" PRIMARY KEY ("eventType");\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: dids PK_8a065e738c56f0bd50f8658f8f0; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.dids\n' +
        '    ADD CONSTRAINT "PK_8a065e738c56f0bd50f8658f8f0" PRIMARY KEY (did);\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: symmetric_keys PK_a8e8f1d57d3f6817a0ab114b2f5; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.symmetric_keys\n' +
        '    ADD CONSTRAINT "PK_a8e8f1d57d3f6817a0ab114b2f5" PRIMARY KEY (id);\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: enrolment PK_c1b11dc21bdb2ccad48ac137822; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.enrolment\n' +
        '    ADD CONSTRAINT "PK_c1b11dc21bdb2ccad48ac137822" PRIMARY KEY (did);\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- Name: identity PK_d0b02e497d54aa8464bdde4f80a; Type: CONSTRAINT; Schema: public; Owner: -\n' +
        '--\n' +
        '\n' +
        'ALTER TABLE ONLY public.identity\n' +
        '    ADD CONSTRAINT "PK_d0b02e497d54aa8464bdde4f80a" PRIMARY KEY (address);\n' +
        '\n' +
        '\n' +
        '--\n' +
        '-- PostgreSQL database dump complete\n' +
        '--\n' +
        '\n'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tablesToDrop = [
      'applications',
      'channels',
      'cron',
      'dids',
      'enrolment',
      'events',
      'files',
      'identity',
      'symmetric_keys',
      'topic',
    ];

    for (const table of tablesToDrop) {
      await queryRunner.dropTable(table, true);
    }
  }
}
