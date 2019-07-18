import { Column } from 'knex-object';

import Entity from '@@src/entities/Entity';

class Foo extends Entity {
  @Column({
    type: ['string', [255]],
  })
  color: string;
}

export default Foo;
