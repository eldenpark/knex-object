import {
  Column,
  KnexEntity,
  KnexEntityFactory,
} from 'knex-object';
import knexInstance from '@@src/knex';

const Entity: typeof KnexEntity = KnexEntityFactory({
  knex: knexInstance,
});

class EntityBase extends Entity {
  @Column('temp')
  created_at: Date;
  id: string;
  updated_at: Date;
}

export default EntityBase;
