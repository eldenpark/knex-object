import chalk from 'chalk';
import Knex from 'knex';
import { logger } from 'jege/server';

import KnexEntity, {
  DataType,
  EntityDefinition,
  TableIndex,
} from './KnexEntity';
import { requireNonNull } from './utils';
import { TABLE_INDEX } from './constants';

const log = logger('[knex-object]');

export function getSchemaBuilder(entities: typeof KnexEntity[]) {
  return function schemaBuilder(knex: Knex) {
    let knexSchemaBuilder = knex.schema;
    entities.forEach((entity) => {
      const {
        entityDefinitions,
        name: entityName,
      } = entity;
      const entityDefinition = entityDefinitions[entityName];
      log(
        `schemaBuilder(): entity ${chalk.green('%s')} is being created with: %j`,
        entityName,
        entityDefinition,
      );

      knexSchemaBuilder = knexSchemaBuilder.createTable(entity.tableName, (table) => {
        appendTableColumns(table, entityDefinition);
        appendTableIndices(table, entityDefinition[TABLE_INDEX]);
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
        `schemaDestroyer(): entity ${chalk.green('%s')} is scheduled to be destroyed if exists`,
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
