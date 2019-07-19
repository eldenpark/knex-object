import Knex from 'knex';
import { logger } from 'jege/server';

const log = logger('[sandbox]');

const config = {
  client: 'pg',
  connection: {
    database: 'knex_object',
    host: 'localhost',
    port: 5432,
    user: 'user1',
  },
  pool: {
    afterCreate: (conn, cb) => {
      log('afterCreate(): pool acquired');
      cb(null, conn);
    },
    max: 10,
    min: 0,
  },
};

const knex = Knex(config);

export default knex;

export {
  config,
};
