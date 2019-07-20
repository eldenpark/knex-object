import { logger } from 'jege/server';

import FooTar from '@@src/entities/FooTar';

const log = logger('[sandbox]');

export default async function behavior() {
  const result = await FooTar.query()
    .insert({
      foo_column2: 11,
    })
    .returning('*');
  log('result: %s', result);
}
