import KnexEntity from './KnexEntity';

export function getTableCreator(entities: typeof KnexEntity[]) {
  entities.forEach((entity) => {
    console.log('getTableCreator(): ', entity.entityDefinitions);
    // const { tableDefinition } = entity;
    // console.log(2, tableDefinition);
  });
}
