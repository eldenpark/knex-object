import {
  Column,
  Table,
} from 'knex-object';

import Entity from '@@src/entities/Entity';

@Table({})
class Foo extends Entity {
  @Column({
    type: ['string', [255]],
  })
  color: string;
}

export default Foo;
