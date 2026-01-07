import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUsers1767811050521 implements MigrationInterface {
    name = 'InitUsers1767811050521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'ADMIN'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }

}
