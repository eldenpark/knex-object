import {
  Column,
  Table,
} from 'knex-object';

import MiddleEntity from '@@src/entities/MiddleEntity';

enum TestEnum {
  POWER = 'P',
  POWER2 = 'P2',
}

@Table()
class Baz extends MiddleEntity {
  @Column({
    type: ['enu', [Object.values(TestEnum)]],
  })
  baz_column1: string;

  @Column({
    index: [],
    type: ['string'],
  })
  baz_column2: string;

  @Column({
    type: ['string'],
  })
  name: string;
}

export default Baz;
