import Knex from 'knex';
import { logger } from 'jege/server';

const log = logger('[knex-object]');

class KnexEntity {
  static __tableDefinition = {};

  static get knex(): Knex {
    log('KnexEntity(): knex() is not defined, object: %s', this.name);
    throw new Error('knex() is not defined');
  }

  static get tableDefinition() {
    if (this.__tableDefinition === undefined) {
      log(
        'KnexEntity(): __tableDefinition is missing. Most likely it is mishandled. object: %s',
        this.name,
      );
      throw new Error('tableDefinition() is missing');
    }
    return this.__tableDefinition;
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
