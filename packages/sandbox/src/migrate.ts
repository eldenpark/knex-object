import { logger } from 'jege/server';

import Foo from '@@src/entities/Foo';

const log = logger('[sandbox]');

export default function migrate() {
  log('migrate()');
  console.log(1, Foo, Foo.tableDefinition);
}
