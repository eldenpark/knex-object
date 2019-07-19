import {
  getTableCreator,
  KnexEntity,
} from 'knex-object';
import { logger } from 'jege/server';

import Bar from '@@src/entities/Bar';
import Foo from '@@src/entities/Foo';

const log = logger('[sandbox]');

export default function migrate() {
  const entities: typeof KnexEntity[] = [
    Bar,
    Foo,
  ];

  log('migrate(): entity count: %s', entities.length);
  const a = getTableCreator(entities);
  console.log(2, a);
}
