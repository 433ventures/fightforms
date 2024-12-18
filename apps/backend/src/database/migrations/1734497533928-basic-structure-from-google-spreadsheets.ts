import { MigrationInterface, QueryRunner } from "typeorm";

export class BasicStructureFromGoogleSpreadsheets1734497533928 implements MigrationInterface {
    name = 'BasicStructureFromGoogleSpreadsheets1734497533928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rowNumber" integer NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "linkedin" character varying, "summary" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "applicationId" uuid NOT NULL, "questionId" uuid NOT NULL, "answer" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7b640474ae24b0c554817261bb9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "inputName" character varying NOT NULL, "label" character varying NOT NULL, "question" character varying NOT NULL, CONSTRAINT "PK_8427ec9b186cc5b4bb54b6b7ae3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "application_answer" ADD CONSTRAINT "FK_429f82a565432a4f81c82508643" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_answer" ADD CONSTRAINT "FK_a04e0a60a9ff9554a645bda8500" FOREIGN KEY ("questionId") REFERENCES "application_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "application_answer" DROP CONSTRAINT "FK_a04e0a60a9ff9554a645bda8500"`);
        await queryRunner.query(`ALTER TABLE "application_answer" DROP CONSTRAINT "FK_429f82a565432a4f81c82508643"`);
        await queryRunner.query(`DROP TABLE "application_question"`);
        await queryRunner.query(`DROP TABLE "application_answer"`);
        await queryRunner.query(`DROP TABLE "application"`);
    }
}
