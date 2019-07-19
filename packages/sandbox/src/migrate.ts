import {
  getSchemaBuilder,
  getSchemaDestroyer,
  KnexEntity,
} from 'knex-object';
import { logger } from 'jege/server';

import knex from '@@src/knex';
import Bar from '@@src/entities/BarTar';
import Foo from '@@src/entities/FooTar';

const log = logger('[sandbox]');

export default async function migrate() {
  const entities: typeof KnexEntity[] = [
    Bar,
    Foo,
  ];

  log('migrate(): entities: %s', entities.map(({ name }) => name));
  const schemaDestroyer = getSchemaDestroyer(entities);
  const destroyResult = await schemaDestroyer(knex);
  log('migrate(): destroyResult: %j', destroyResult);

  const schemaBuilder = getSchemaBuilder(entities);
  const buildResult = await schemaBuilder(knex);
  log('migrate(): buildResult: %j', buildResult);
}
