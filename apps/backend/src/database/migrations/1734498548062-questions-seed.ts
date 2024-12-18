import { MigrationInterface, QueryRunner } from "typeorm";

export class QuestionsSeed1734498548062 implements MigrationInterface {
    name = 'QuestionsSeed1734498548062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "application_question" ("inputName", "label", "question") VALUES ('amount', 'How much are you looking to borrow?', 'How much are you looking to borrow?')`);
        await queryRunner.query(`INSERT INTO "application_question" ("inputName", "label", "question") VALUES ('due_date', 'When are you looking to have the funds?', 'When are you looking to have the funds?')`);
        await queryRunner.query(`INSERT INTO "application_question" ("inputName", "label", "question") VALUES ('purpose', 'What is the finance for?', 'What is the finance for?')`);
        await queryRunner.query(`INSERT INTO "application_question" ("inputName", "label", "question") VALUES ('business_name', 'What is the name of your business?', 'What is the name of your business?')`);
        await queryRunner.query(`INSERT INTO "application_question" ("inputName", "label", "question") VALUES ('business_description', 'Can you provide a brief description of what it does?', 'Can you provide a brief description of what it does?')`);
        await queryRunner.query(`INSERT INTO "application_question" ("inputName", "label", "question") VALUES ('business_operating_duration', 'How long has your business been operating?', 'How long has your business been operating?')`);
        await queryRunner.query(`INSERT INTO "application_question" ("inputName", "label", "question") VALUES ('business_turnover', 'How much did your business turnover last year?', 'How much did your business turnover last year?')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "application_question"`);
    }

}
