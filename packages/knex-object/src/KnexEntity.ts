import Knex from 'knex';
import { logger } from 'jege/server';

import {
  ENTITY_DEFINITION,
  IS_COLUMN,
  IS_ENTITY,
  KNEX,
} from './constants';
import { toSnakeCase } from './utils';

const log = logger('[knex-object]');

class KnexEntity {
  static [IS_ENTITY] = true;
  static [KNEX]: Knex;

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

  static get entityDefinition(): EntityDefinition {
    const entityDefinition = this[ENTITY_DEFINITION];
    if (entityDefinition === undefined) {
      throw new Error('get entityDefinition(): not defined, possible this object is not Knext Entity');
    }
    return entityDefinition;
  }

  static getTableName(): string {
    const tableNameInEntityDefinition = this[ENTITY_DEFINITION].tableName;

    if (tableNameInEntityDefinition) {
      return tableNameInEntityDefinition;
    }
    return toSnakeCase(this.name).toUpperCase();
  }

  static query(): Knex.QueryBuilder {
    const tableName = this.getTableName();
    if (!tableName) {
      log(`query(): Object is not 'Table' entity. Did you decorate with @Table?: %s`, this.name);
      throw new Error('not Table entity');
    }
    return this[KNEX](tableName);
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
  columns: {
    [columnName: string]: ColumnType;
  };
  index?: TableIndex[];
  tableName?: string;
}

export interface TableIndex {
  columns: string[];
  key?: string;
}

export type ColumnType = {
  [IS_COLUMN]: true;
  columnDefinition: ColumnDefinition;
  entityName: string;
  propertyName: string;
};

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
