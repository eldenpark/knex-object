const knexObject = '__knex_object__';

const ENTITY_DEFINITION = Symbol(`${knexObject}entityDefinition`);
const IS_COLUMN = Symbol(`${knexObject}isColumn`);
const IS_ENTITY = Symbol(`${knexObject}isEntity`);
const KNEX = Symbol(`${knexObject}knex`);
const NEVER_ASSIGN = Symbol(`${knexObject}neverAssign`);

export {
  ENTITY_DEFINITION,
  IS_COLUMN,
  IS_ENTITY,
  KNEX,
  NEVER_ASSIGN,
};
