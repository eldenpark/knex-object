import {
  Column,
  Table,
} from 'knex-object';

import Entity from '@@src/entities/Entity';

@Table({
  index: [
    {
      columns: ['power'],
    },
  ],
})
class Foo extends Entity {
  @Column({
    type: ['string', [255]],
  })
  color: string;

  @Column({
    type: ['float'],
  })
  column1: number;

  @Column({
    type: ['string', [32]],
  })
  column2: string;
}

export default Foo;
