import chalk from 'chalk';
import Knex from 'knex';
import { logger } from 'jege/server';

import KnexEntity, {
  DataType,
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
        // console.log(333, entity.tableName);

        Object.entries(entityDefinition)
          .forEach(([columnName, columnDefinition]) => {
            // console.log(444, columnName);
            const [typeLabel, typeFnArgs]: DataType = columnDefinition.type;
            requireNonNull(typeLabel, 'type label, e.g. float(), should be confifugured');
            let knexColumnBuilder = table[typeLabel](columnName, ...(typeFnArgs || []));

            Object.entries(columnDefinition)
              .forEach(([columnModifier, columnMidifierArgs]) => {
                // console.log(555, columnModifier);
                if (columnModifier !== 'type') {
                  const fnArgs = columnMidifierArgs.length ? columnMidifierArgs : [];
                  knexColumnBuilder = knexColumnBuilder[columnModifier](...fnArgs);
                }
              });
          });

        if (entityDefinition[TABLE_INDEX]) {
          entityDefinition[TABLE_INDEX]!.forEach(({ columns, key }) => {
            table.index(columns, key);
          });
        }
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
