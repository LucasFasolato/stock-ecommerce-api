import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUsers1767812573177 implements MigrationInterface {
    name = 'InitUsers1767812573177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock_movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "quantity" integer NOT NULL, "note" text, "createdByUserId" uuid, "referenceId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid NOT NULL, CONSTRAINT "PK_57a26b190618550d8e65fb860e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3acb59db67e977be45e382fc5" ON "stock_movements" ("productId") `);
        await queryRunner.query(`ALTER TABLE "products" ADD "stock" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "stock_movements" ADD CONSTRAINT "FK_a3acb59db67e977be45e382fc56" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_movements" DROP CONSTRAINT "FK_a3acb59db67e977be45e382fc56"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "stock"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3acb59db67e977be45e382fc5"`);
        await queryRunner.query(`DROP TABLE "stock_movements"`);
    }

}
