import {
  Column,
  Table,
} from 'knex-object';

import Entity from '@@src/entities/Entity';

@Table({
  index: [
    {
      columns: ['bar_tar_column1', 'bar_tar_column3'],
      key: 'bar_tar_index2',
    },
  ],
})
class BarTar extends Entity {
  @Column({
    type: ['string', [255]],
  })
  bar_tar_column1: string;

  @Column({
    type: ['float'],
  })
  bar_tar_column2: number;

  @Column({
    type: ['string', [32]],
  })
  bar_tar_column3: string;
}

export default BarTar;
