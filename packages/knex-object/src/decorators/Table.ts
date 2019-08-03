import { logger } from 'jege/server';

import {
  ClassElement,
  ClassMemberElement,
  TableArgs,
} from './DecoratorTypes';
import {
  ENTITY_DEFINITION,
  IS_COLUMN,
  IS_ENTITY,
} from '../constants';
import { EntityDefinition } from '../entities/KnexEntityTypes';
import { getPrintableEntityDefinition } from '../utils';
import KnexEntity from '../entities/KnexEntity';

const log = logger('[knex-object]');

export default function Table({
  index,
  tableName,
}: TableArgs = {}) {
  // `...args` to prevent TypeScript warning which has different decorator spec
  return function TableDecorator(target, ...args) { // eslint-disable-line
    const { elements, kind } = target as ClassElement;

    if (kind !== 'class') {
      throw new Error(`TableDecorator(): '@Table' should be put onto class`);
    }

    const newElement: ClassMemberElement = {
      descriptor: {
        configurable: false,
        enumerable: true,
        writable: false,
      },
      initializer: function initializer(): EntityDefinition {
        const entities = getPrototypeEntityConstructors(this);
        const columns = createColumnDefinitions(entities);
        const entityDefinition: EntityDefinition = {
          columns,
          index,
          tableName,
        };

        log(
          `@Table(): decorated [[ %s ]], entityDefinition: %j`,
          this.name,
          getPrintableEntityDefinition(entityDefinition),
        );

        return entityDefinition;
      },
      key: ENTITY_DEFINITION,
      kind: 'field',
      placement: 'static',
    };

    return {
      ...target,
      elements: [
        ...elements,
        newElement,
      ],
    };
  };
}

function createColumnDefinitions(entities) {
  const columns = {};
  entities.forEach((entity) => {
    Object.entries(entity)
      .forEach(([key, value]: any) => {
        if (value[IS_COLUMN]) {
          columns[key] = value;
        }
      });
  });
  return columns;
}

function getPrototypeEntityConstructors(entity: typeof KnexEntity) {
  const ancestors: any[] = [];
  function getPrototypeRecursive(obj) {
    const constructorName = obj.constructor.name;
    if (!obj.constructor[IS_ENTITY]
      || constructorName === 'DO_NOT_CHANGE__generatedKnexEntity') {
      return;
    }
    getPrototypeRecursive(Object.getPrototypeOf(obj));
    ancestors.push(obj.constructor);
  }

  getPrototypeRecursive(Object.getPrototypeOf(entity.prototype));
  ancestors.push(entity);
  return ancestors;
}
