// import chalk from 'chalk';
import Knex from 'knex';
import { logger } from 'jege/server';

import {
  ColumnType,
  DataType,
  TableIndex,
} from '../entities/KnexEntityTypes';
import KnexEntity from '../entities/KnexEntity';
import { requireNonNull } from '../utils';

const log = logger('[knex-object]');

export function getSchemaBuilder(entities: typeof KnexEntity[]) {
  return function schemaBuilder(knex: Knex) {
    let knexSchemaBuilder = knex.schema;
    entities.forEach((entity) => {
      const {
        name: entityName,
      } = entity;
      const tableName = entity.getTableName();
      const printableEntityDefinition = entity.getEntityDefinition();
      const entityDefinition = entity.getEntityDefinition(false);

      log(
        `schemaBuilder(): build entity [[ %s ]], tableName: %s, entityDefinition: %j`,
        entityName,
        tableName,
        printableEntityDefinition,
      );

      knexSchemaBuilder = knexSchemaBuilder.createTable(tableName, (table) => {
        appendTableColumns(table, entityDefinition.columns);
        appendTableIndices(table, entityDefinition.index);
      });
    });

    const query = knexSchemaBuilder.toQuery().replace(/\n/g, ' ');
    log('schemaBuilder(): finalized query: %s', query);

    return knexSchemaBuilder;
  };
}

export function getSchemaDestroyer(entities: typeof KnexEntity[]) {
  return function schemaDestroyer(knex: Knex) {
    let knexSchemaBuilder = knex.schema;
    entities.forEach((entity) => {
      const tableName = entity.getTableName();
      log(
        `schemaDestroyer(): destroying if exists, entity: [[ %s ]], tableName: %s`,
        entity.name,
        tableName,
      );
      knexSchemaBuilder = knexSchemaBuilder.dropTableIfExists(tableName);
    });

    const query = knexSchemaBuilder.toQuery().replace(/\n/g, ' ');
    log('schemaDestroyer(): finalized query: %s', query);

    return knexSchemaBuilder;
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
