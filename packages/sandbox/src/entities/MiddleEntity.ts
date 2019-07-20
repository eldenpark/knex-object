import {
  Column,
} from 'knex-object';

import Entity from '@@src/entities/Entity';

class MiddleEntity extends Entity {
  @Column({
    type: ['string', [256]],
  })
  middle_entity_column1: string;
}

export default MiddleEntity;
