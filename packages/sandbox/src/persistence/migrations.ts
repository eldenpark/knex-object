import {
  getSchemaBuilder,
  getSchemaDestroyer,
  KnexEntity,
} from 'knex-object';
import { logger } from 'jege/server';

import BarTar from '@@src/entities/BarTar';
import Baz from '@@src/entities/Baz';
import FooTar from '@@src/entities/FooTar';
import knex from '@@src/knex';

const log = logger('[sandbox]');

const entities: typeof KnexEntity[] = [
  BarTar,
  Baz,
  FooTar,
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
