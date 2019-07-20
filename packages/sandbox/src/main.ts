import chalk from 'chalk';
import { logger } from 'jege/server';

import behavior from '@@src/behaviors';
import knex, { config } from '@@src/knex';

const log = logger('[sandbox]');

export default async function main() {
  await testDBConnection();
  await behavior();
}

async function testDBConnection() {
  try {
    log('testDBConnection(): try connecting...');
    const connectionSuccess = await knex.raw('select now()');
    log('testDBConnection(): connection success: %j', connectionSuccess);
  } catch (err) {
    log(
      `testDBConnection(): connection ${chalk.red('error')}. Did you setup test DB instance with this config?: %j`,
      config,
    );
    throw new Error('db connection error');
  }
}
