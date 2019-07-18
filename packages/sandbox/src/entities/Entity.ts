import {
  Column,
  KnexEntity,
  KnexEntityFactory,
  Table,
} from 'knex-object';
import knexInstance from '@@src/knex';

const Entity: typeof KnexEntity = KnexEntityFactory({
  knex: knexInstance,
});

class EntityBase extends Entity {
  @Column({
    type: ['timestamp'],
  })
  created_at: Date;

  @Column({
    type: ['increments'],
  })
  id: string;

  @Column({
    type: ['timestamp'],
  })
  updated_at: Date;
}

export default EntityBase;
