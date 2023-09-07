import { MigrationInterface, QueryRunner } from 'typeorm';

export class messages1692260242941 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."address_book" (
                                           "did" VARCHAR(255) PRIMARY KEY,
                                           "name" VARCHAR(255) UNIQUE,
                                           "createdDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           "updatedDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
