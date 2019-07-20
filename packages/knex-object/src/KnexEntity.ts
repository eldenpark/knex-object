import Knex from 'knex';
import { logger } from 'jege/server';

import {
  ANCESTOR_ENTITIES,
  IS_KNEX_ENTITY,
  KNEX,
  KNEX_TABLE,
  SHARED_ENTITY_DEFINITIONS,
  TABLE_INDEX,
} from './constants';
import { toSnakeCase } from './utils';

const log = logger('[knex-object]');

class KnexEntity {
  static [IS_KNEX_ENTITY] = true;
  static [KNEX]: Knex;
  static [SHARED_ENTITY_DEFINITIONS]: SharedEntityDefinitions = {};

  static get knex(): Knex {
    if (this[KNEX] === undefined) {
      log(
        'KnexEntity(): knex is undefined. Most likely Entity is initialized wrongfully',
        this.name,
      );
      throw new Error('knex is undefined');
    }
    return this[KNEX];
  }

  static set knex(knex: Knex) {
    this[KNEX] = knex;
  }

  static get entityDefinitions() {
    if (this[SHARED_ENTITY_DEFINITIONS] === undefined) {
      log(
        'entityDefinitions(): __tableDefinition is missing. Most likely it is mishandled. object: %s',
        this.name,
      );
      throw new Error('tableDefinition() is missing');
    }
    return this[SHARED_ENTITY_DEFINITIONS];
  }

  static get tableName(): string {
    return toSnakeCase(this.name);
  }

  static query(): Knex.QueryBuilder {
    const knexTable = this[KNEX_TABLE];
    if (!knexTable) {
      log(`query(): Object is not 'Table' entity. Did you decorate with @Table?: %s`, this.name);
      throw new Error('not Table entity');
    }
    return this[KNEX](this.tableName);
  }
}

export default KnexEntity;

export function KnexEntityFactory({
  knex,
}: KnexEntityFactoryArgs) {
  return class DO_NOT_CHANGE__generatedKnexEntity extends KnexEntity { // eslint-disable-line
    static knex = knex;
  };
}

export interface SharedEntityDefinitions {
  [entityName: string]: EntityDefinition;
}

export interface EntityDefinition {
  [ANCESTOR_ENTITIES]?: string[];
  [TABLE_INDEX]?: TableIndex[];
  [columnName: string]: ColumnDefinition;
}

export interface TableIndex {
  columns: string[];
  key?: string;
}

export interface ColumnDefinition {
  comment?: [string];
  defaultTo?: [any];
  index?: [string?];
  notNullable?: boolean;
  primary?: boolean;
  type: DataType;
  unique?: boolean;
}

export type DataType
= BigIntegerType
| BooleanType
| DateTimeType
| EnumDataType
| FloatDataType
| IncrementsType
| IntegerType
| StringDataType
| TextType
| TimestampType;

type BigIntegerType = ['bigInteger'];
type BooleanType = ['boolean'];
type DateTimeType = ['datetime'];
type EnumDataType = ['enu', [string[]]];
type FloatDataType = ['float', [number?, number?]?];
type IncrementsType = ['increments'];
type IntegerType = ['integer'];
type StringDataType = ['string', [number?]?];
type TextType = ['text'];
type TimestampType = ['timestamp'];

interface KnexEntityFactoryArgs {
  knex: Knex;
}
