import type { MigrationInterface, QueryRunner } from 'typeorm';

export class FinalTestData1700000000004 implements MigrationInterface {
  name = 'FinalTestData1700000000004';

  private readonly auth0Id = 'auth0|69825f4024278995a75bee2f';
  private readonly userId = '69825f40-2427-8995-a75b-ee2f69825f40';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Insert user with fixed UUID
    await queryRunner.query(`
      INSERT INTO "users" (id, auth0_id)
      VALUES ('${this.userId}', '${this.auth0Id}')
      ON CONFLICT (auth0_id) DO NOTHING;
    `);

    // Insert user configuration
    await queryRunner.query(`
      INSERT INTO "user_config_entity" (id, "userId", "expenseLimitByDay", currency, "startDayOfWeek")
      VALUES ('c4a76042-df8f-45a4-8f8f-8f8f8f8f8f8f', '${this.userId}'::uuid, 50.00, 'EUR', 'MONDAY')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insert test expenses one by one to avoid UUID casting issues
    await queryRunner.query(`
      INSERT INTO "expense_entity" (id, "userId", amount, description, date, "createdAt", "updatedAt")
      VALUES ('e1f2a3b4-c5d6-47e8-f9a0-b1c2d3e4f5a6', '${this.userId}'::uuid, '25.50', 'Grocery shopping', '2023-10-15 10:00:00', '2023-10-15 10:00:00', '2023-10-15 10:00:00')
      ON CONFLICT (id) DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO "expense_entity" (id, "userId", amount, description, date, "createdAt", "updatedAt")
      VALUES ('f2g3h4i5-6789-48a9-a0b1-b2c3d4e5f6a7', '${this.userId}'::uuid, '15.25', 'Coffee with friends', '2023-10-16 14:30:00', '2023-10-16 14:30:00', '2023-10-16 14:30:00')
      ON CONFLICT (id) DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO "expense_entity" (id, "userId", amount, description, date, "createdAt", "updatedAt")
      VALUES ('g3h4i5j6-7890-49b0-a1c2-b3d4e5f6a7b8', '${this.userId}'::uuid, '45.75', 'Restaurant dinner', '2023-10-17 19:00:00', '2023-10-17 19:00:00', '2023-10-17 19:00:00')
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Delete expenses
    await queryRunner.query(`
      DELETE FROM "expense_entity" WHERE "userId" = '${this.userId}'::uuid;
    `);

    // Delete configuration
    await queryRunner.query(`
      DELETE FROM "user_config_entity" WHERE "userId" = '${this.userId}'::uuid;
    `);

    // Delete user
    await queryRunner.query(`
      DELETE FROM "users" WHERE id = '${this.userId}';
    `);
  }
}
