import {
  Column,
  Table,
} from 'knex-object';

import Entity from '@@src/entities/Entity';

@Table({
  index: [
    {
      columns: ['foo_column1'],
    },
  ],
})
class FooTar extends Entity {
  static tableName = 'intentionally_different_name';

  @Column({
    defaultTo: ['power'],
    type: ['string', [255]],
  })
  foo_column1: string;

  @Column({
    type: ['float'],
    unique: true,
  })
  foo_column2: number;

  @Column({
    type: ['string', [32]],
  })
  foo_column3: string;
}

export default FooTar;
