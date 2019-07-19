import chalk from 'chalk';
import { logger } from 'jege/server';

import knex, { config } from '@@src/knex';
import { down, up } from '@@src/migrate';

const log = logger('[sandbox]');

export default async function main() {
  try {
    log('main(): try connecting...');
    const connectionSuccess = await knex.raw('select now()');
    log('main(): connection success: %j', connectionSuccess);
  } catch (err) {
    log(
      `main(): connection ${chalk.red('error')}. Did you setup test DB instance with this config?: %j`,
      config,
    );
  }
  await testMigration();
}

async function testMigration() {
  try {
    const downResult = await down();
    log('testMigration(): downResult: %j', downResult);

    const upResult = await up();
    log('testMigration(): upResult: %j', upResult);
  } catch (err) {
    log('testMigration(): error migrating: %o', err);
  }
}
