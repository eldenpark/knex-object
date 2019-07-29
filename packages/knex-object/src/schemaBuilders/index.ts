import chalk from 'chalk';
import Knex from 'knex';
import { logger } from 'jege/server';

import KnexEntity, {
  ColumnType,
  DataType,
  TableIndex,
} from '../KnexEntity';
import { requireNonNull } from '../utils';

const log = logger('[knex-object]');

export function getSchemaBuilder(entities: typeof KnexEntity[]) {
  return function schemaBuilder(knex: Knex) {
    let knexSchemaBuilder = knex.schema;
    entities.forEach((entity) => {
      const {
        entityDefinition,
        name: entityName,
      } = entity;
      const tableName = entity.getTableName();

      log(
        `schemaBuilder(): entity ${chalk.green('%s')}, tableName: %s, entityDefinition: %j`,
        entityName,
        tableName,
        entityDefinition,
      );

      knexSchemaBuilder = knexSchemaBuilder.createTable(tableName, (table) => {
        appendTableColumns(table, entityDefinition.columns);
        appendTableIndices(table, entityDefinition.index);
      });
    });
    return knexSchemaBuilder;
  };
}

export function getSchemaDestroyer(entities: typeof KnexEntity[]) {
  return function schemaDestroyer(knex: Knex) {
    let chained = knex.schema;
    entities.forEach((entity) => {
      const tableName = entity.getTableName();
      log(
        `schemaDestroyer(): destroying if exists, entity: ${chalk.green('%s')}, tableName: %s`,
        entity.name,
        tableName,
      );
      chained = chained.dropTableIfExists(tableName);
    });
    return chained;
  };
}

function appendTableColumns(table: Knex.CreateTableBuilder, columns: Columns) {
  Object.entries(columns)
    .forEach(([, column]) => {
      const { columnDefinition, propertyName } = column;
      const [typeLabel, typeFnArgs]: DataType = columnDefinition.type;
      requireNonNull(typeLabel, 'type label, e.g. float(), should be confifugured');
      const knexColumnBuilder: Knex.ColumnBuilder = table[typeLabel](
        propertyName,
        ...(typeFnArgs || []),
      );

      Object.entries(columnDefinition)
        .forEach(([columnModifier, columnModifierArgs]) => {
          if (columnModifier !== 'type') {
            const fnArgs = columnModifierArgs.length ? columnModifierArgs : [];
            knexColumnBuilder[columnModifier](...fnArgs);
          }
        });
    });
}

function appendTableIndices(table: Knex.CreateTableBuilder, tableIndices: TableIndex[] = []) {
  tableIndices.forEach(({ columns, key }) => {
    table.index(columns, key);
  });
  return table;
}

type Columns = {
  [columnName: string]: ColumnType;
};
