import { logger } from 'jege/server';

import knex from '@@src/knex';
import migrate from '@@src/migrate';

const log = logger('[sandbox]');

export default async function main() {
  try {
    log('main(): try connecting...');
    const connectionSuccess = await knex.raw('select now()');
    log('main(): connection success: %j', connectionSuccess);

    await migrate();
    process.exit(0);
  } catch (err) {
    log('main(): error connecting: %o', err);
  }
}
