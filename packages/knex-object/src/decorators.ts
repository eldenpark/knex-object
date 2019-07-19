import chalk from 'chalk';
import { logger } from 'jege/server';

import KnexEntity, {
  ColumnDefinition,
  TableIndex,
} from './KnexEntity';
import {
  IS_KNEX_ENTITY,
  SHARED_ENTITY_DEFINITIONS,
  TABLE_INDEX,
  ANCESTOR_ENTITIES,
} from './constants';

const log = logger('[knex-object]');

// @Table({
//   index: [
//     [['p', 'q']],
//   ],
// })
// class A {
//   @Column({
//     type: ['string', [12]],
//   })
//   paa;
//   q;
//   r;
// }

const insignificantObject = {
  __generatedFieldNotTobeUsed: 1,
};

export function Column(columnArgs: ColumnArgs) {
  // `...args` to prevent TypeScript warning which has different decorator spec
  return function ColumnDecorator(target, ...args) { // eslint-disable-line
    const {
      key,
      kind,
      placement,
    } = target as ClassMemberElement;

    if (kind !== 'field') {
      throw new Error(`ColumnDecorator(): '@Column' should be put onto field`);
    }

    if (placement !== 'own') {
      throw new Error(`ColumnDecorator(): '@Column' should be put onto instance variable`);
    }

    function initializer(this: typeof KnexEntity) {
      const entityName = this.name;
      if (this[SHARED_ENTITY_DEFINITIONS] === undefined) {
        throw new Error(
          `ColumnDecorator(): '@Column may have attached onto non KnexEntity, ${this.name}`,
        );
      }

      if (this[SHARED_ENTITY_DEFINITIONS][entityName] === undefined) {
        this[SHARED_ENTITY_DEFINITIONS][entityName] = {
          [key]: columnArgs,
        };
      } else {
        this[SHARED_ENTITY_DEFINITIONS][entityName][key as any] = columnArgs;
      }

      return insignificantObject;
    }

    const newDescriptor = {
      configurable: false,
      enumerable: false,
      writable: false,
    };

    return {
      ...target,
      extras: [
        {
          descriptor: newDescriptor,
          initializer,
          key,
          kind: 'field',
          placement: 'static',
        },
      ],
    };
  };
}

export function Table({
  index,
}: TableArgs) {
  // `...args` to prevent TypeScript warning which has different decorator spec
  return function TableDecorator(target, ...args) { // eslint-disable-line
    const { elements, kind } = target as ClassElement;

    if (kind !== 'class') {
      throw new Error(`TableDecorator(): '@Table' should be put onto class`);
    }

    const newElement: ClassMemberElement = {
      descriptor: {
        configurable: false,
        enumerable: false,
        writable: false,
      },
      initializer: function initializer() {
        const entityName = this.name;
        if (this[SHARED_ENTITY_DEFINITIONS] === undefined) {
          throw new Error(
            `ColumnDecorator(): '@Table may have attached onto non KnexEntity, ${this.name}`,
          );
        }
        const ancestorEntities = getAncestorEntities(this);
        this[SHARED_ENTITY_DEFINITIONS][entityName][TABLE_INDEX] = index;
        this[SHARED_ENTITY_DEFINITIONS][entityName][ANCESTOR_ENTITIES] = ancestorEntities;

        log(`Table(): decorated ${chalk.green(entityName)}, %j`, this[SHARED_ENTITY_DEFINITIONS]);
        return insignificantObject;
      },
      key: TABLE_INDEX,
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

function getAncestorEntities(entity: typeof KnexEntity) {
  const ancestors: string[] = [];
  function getPrototype(obj) {
    const constructorName = obj.constructor.name;
    if (!obj.constructor[IS_KNEX_ENTITY] || constructorName === '__generatedKnexEntity') {
      return;
    }
    ancestors.push(obj.constructor.name);
    getPrototype(Object.getPrototypeOf(obj));
  }

  getPrototype(entity.prototype);
  return ancestors;
}

type ColumnArgs = ColumnDefinition;

interface TableArgs {
  index?: TableIndex[];
}

interface ClassElement {
  elements: ClassMemberElement[];
  kind: string;
}

interface ClassMemberElement {
  descriptor: ElementDescriptor;
  initializer: () => any;
  key: string | symbol;
  kind: string;
  placement: string;
}

interface ElementDescriptor {
  configurable: boolean;
  enumerable: boolean;
  value?: any;
  writable: boolean;
}
