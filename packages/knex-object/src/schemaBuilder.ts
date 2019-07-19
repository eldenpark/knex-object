import chalk from 'chalk';
import Knex from 'knex';
import { logger } from 'jege/server';

import KnexEntity, {
  DataType,
  EntityDefinition,
  SharedEntityDefinitions,
  TableIndex,
} from './KnexEntity';
import { requireNonNull } from './utils';
import {
  ANCESTOR_ENTITIES,
  TABLE_INDEX,
} from './constants';

const log = logger('[knex-object]');

export function getSchemaBuilder(entities: typeof KnexEntity[]) {
  return function schemaBuilder(knex: Knex) {
    let knexSchemaBuilder = knex.schema;
    entities.forEach((entity) => {
      const {
        entityDefinitions,
        name: entityName,
      } = entity;
      const aggregateEntityDefinition = aggreteEntityDefinition(entityName, entityDefinitions);

      log(
        `schemaBuilder(): entity ${chalk.green('%s')}, tableName: %s, aggregateEntityDefinition: %j, ancestorEntities: %j, tableIndex: %j`,
        entityName,
        entity.tableName,
        aggregateEntityDefinition,
        aggregateEntityDefinition[ANCESTOR_ENTITIES],
        aggregateEntityDefinition[TABLE_INDEX],
      );

      knexSchemaBuilder = knexSchemaBuilder.createTable(entity.tableName, (table) => {
        appendTableColumns(table, aggregateEntityDefinition);
        appendTableIndices(table, aggregateEntityDefinition[TABLE_INDEX]);
      });
    });
    return knexSchemaBuilder;
  };
}

export function getSchemaDestroyer(entities: typeof KnexEntity[]) {
  return function schemaDestroyer(knex: Knex) {
    let chained = knex.schema;
    entities.forEach((entity) => {
      log(
        `schemaDestroyer(): destroying if exists, entity: ${chalk.green('%s')}, tableName: %s`,
        entity.name,
        entity.tableName,
      );
      chained = chained.dropTableIfExists(entity.tableName);
    });
    return chained;
  };
}

function appendTableColumns(table: Knex.CreateTableBuilder, entityDefinition: EntityDefinition) {
  Object.entries(entityDefinition)
    .forEach(([columnName, columnDefinition]) => {
      const [typeLabel, typeFnArgs]: DataType = columnDefinition.type;
      requireNonNull(typeLabel, 'type label, e.g. float(), should be confifugured');
      const knexColumnBuilder: Knex.ColumnBuilder = table[typeLabel](
        columnName,
        ...(typeFnArgs || []),
      );

      Object.entries(columnDefinition)
        .forEach(([columnModifier, columnMidifierArgs]) => {
          if (columnModifier !== 'type') {
            const fnArgs = columnMidifierArgs.length ? columnMidifierArgs : [];
            knexColumnBuilder[columnModifier](...fnArgs);
          }
        });
    });
}

function appendTableIndices(table: Knex.CreateTableBuilder, tableIndices?: TableIndex[]) {
  let _table = table;
  if (tableIndices) {
    tableIndices.forEach(({ columns, key }) => {
      _table = _table.index(columns, key);
    });
  }
  return _table;
}

function aggreteEntityDefinition(entityName: string, entityDefinitions: SharedEntityDefinitions) {
  const entityDefinition = entityDefinitions[entityName];
  requireNonNull(entityDefinition, 'aggreteEntityDefinition(): entityDefinition should exist');

  let aggregateEntityDefinition: EntityDefinition = {
    [TABLE_INDEX]: [],
  };

  if (entityDefinition[ANCESTOR_ENTITIES]) {
    entityDefinition[ANCESTOR_ENTITIES]!.forEach((ancestor) => {
      const tableIndex = entityDefinitions[ancestor][TABLE_INDEX];
      if (tableIndex) {
        aggregateEntityDefinition[TABLE_INDEX]!.concat(tableIndex);
      }
      aggregateEntityDefinition = {
        ...aggregateEntityDefinition,
        ...entityDefinitions[ancestor],
      };
    });
  }
  return {
    ...aggregateEntityDefinition,
    ...entityDefinition,
  };
}
