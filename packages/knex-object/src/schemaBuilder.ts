import chalk from 'chalk';
import Knex from 'knex';
import { logger } from 'jege/server';

import KnexEntity from './KnexEntity';

const log = logger('[knex-object]');

export function getSchemaBuilder(entities: typeof KnexEntity[]) {
  const schemaBuildFn = (knex) => knex.schama;
  entities.forEach((entity) => {
    const {
      entityDefinitions,
      name: entityName,
    } = entity;
    console.log('getSchemaBuilder(): name: %s, def: %j', entityName, entityDefinitions);

    // createEntityBuilder(knex, entityDefinitions[entityName]);
    // const entityDefinitions[entity.name]);
    // return (knex: Knex) => {
    //   knex.create
    // };
    // const { tableDefinition } = entity;
    // console.log(2, tableDefinition);

    // return knex.schema
    //   .createTable(Product.tableName, (table) => {
    //     setEntityBaseProperties(table);
    //     table.enum('currency', Object.values(Currency));
    //     table.string('img_url', 512)
    //       .notNullable();
    //     table.string('label', 255)
    //       .notNullable();
    //     table.float('price')
    //       .notNullable();
    //     table.string('product_no', 255)
    //       .notNullable()
    //       .unique();
    //   })

    //   .createTable(Order.tableName, (table) => {
    //     setEntityBaseProperties(table);
    //     table.string('order_no', 255)
    //       .notNullable();
    //     table.enu('payment_status', Object.values(PaymentStatus))
    //       .defaultTo(PaymentStatus.UNPAID)
    //       .notNullable();
    //     table.string('user_no', 255)
    //       .notNullable();
    //   })

    // .dropTableIfExists(Product.tableName)
  });
  return (knex: Knex) => schemaBuildFn(knex);
}

export function getSchemaDestroyer(entities: typeof KnexEntity[]) {
  return (knex: Knex) => {
    let chained = knex.schema;
    entities.forEach((entity) => {
      log(
        `getSchemaDestroyer(): ${chalk.green('%s')} is scheduled to be destroyed`,
        entity.tableName,
      );
      chained = chained.dropTableIfExists(entity.tableName);
    });
    return chained;
  };
}

// function createEntityBuilder(knex: Knex, entityDefinition: EntityDefinition) {
//   Object.entries(entityDefinition)
//     .forEach(([key, value]) => {
//       const { type } = value;
//       // chain(acc, (acc) => {

//       // });
//     });
// }

// function chain<T>(acc: T, fn: (arg: T) => T) {
//   return fn(acc);
// }
