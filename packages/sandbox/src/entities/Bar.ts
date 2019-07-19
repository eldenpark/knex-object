import {
  Column,
  Table,
} from 'knex-object';

import Entity from '@@src/entities/Entity';

@Table({
  index: [
    {
      columns: ['bar_column1', 'bar_column3'],
      key: 'bar_index2',
    },
  ],
})
class Bar extends Entity {
  @Column({
    type: ['string', [255]],
  })
  bar_column1: string;

  @Column({
    type: ['float'],
  })
  bar_column2: number;

  @Column({
    type: ['string', [32]],
  })
  bar_column3: string;
}

export default Bar;
