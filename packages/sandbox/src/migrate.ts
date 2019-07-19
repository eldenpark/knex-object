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

const entities: typeof KnexEntity[] = [
  Bar,
  Foo,
];

export async function up() {
  log('up(): entities: %s', entities.map(({ name }) => name));
  const schemaBuilder = getSchemaBuilder(entities);
  return schemaBuilder(knex);
}

export function down() {
  log('down(): entities: %s', entities.map(({ name }) => name));
  const schemaDestroyer = getSchemaDestroyer(entities);
  return schemaDestroyer(knex);
}
