const knexObject = '__knex_object__';

const IS_COLUMN = Symbol(`${knexObject}isColumn`);
const ENTITY_DEFINITION = Symbol(`${knexObject}entityDefinition`);
const IS_ENTITY = Symbol(`${knexObject}isEntity`);
const KNEX = Symbol(`${knexObject}knex`);

export {
  ENTITY_DEFINITION,
  IS_COLUMN,
  IS_ENTITY,
  KNEX,
};
