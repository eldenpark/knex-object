import Knex from 'knex';
import { logger } from 'jege/server';

import {
  KNEX,
  TABLE_DEFINITION,
} from './constants';

const log = logger('[knex-object]');

class KnexEntity {
  static [TABLE_DEFINITION] = {};
  static [KNEX]: Knex;

  static get knex(): Knex {
    if (this[KNEX] === undefined) {
      log('KnexEntity(): knex() is not defined, object: %s', this.name);
      throw new Error('knex() is not defined');
    }
    return this[KNEX];
  }

  static set knex(knex: Knex) {
    this[KNEX] = knex;
  }

  static get tableDefinition() {
    if (this[TABLE_DEFINITION] === undefined) {
      log(
        'KnexEntity(): __tableDefinition is missing. Most likely it is mishandled. object: %s',
        this.name,
      );
      throw new Error('tableDefinition() is missing');
    }
    return this[TABLE_DEFINITION];
  }

  static get tableName(): string {
    log('KenxEntity(): tableName is not defined, object: %s', this.name);
    throw new Error('tableName is not defined');
  }
}

export default KnexEntity;

export function KnexEntityFactory({
  knex,
}: KnexEntityFactoryArgs) {
  return class GeneratedKnexEntity extends KnexEntity {
    static knex = knex;
  };
}

interface KnexEntityFactoryArgs {
  knex: Knex;
}
