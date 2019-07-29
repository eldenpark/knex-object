import {
  ClassMemberElement,
} from './DecoratorTypes';
import {
  ColumnType,
  ColumnDefinition,
} from '../entities/KnexEntityTypes';
import {
  IS_COLUMN,
} from '../constants';
import KnexEntity from '../entities/KnexEntity';

export default function Column(columnDefinition: ColumnDefinition) {
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

    function initializer(this: typeof KnexEntity): ColumnType {
      const entityName = this.prototype.constructor.name;

      return {
        columnDefinition,
        entityName,
        [IS_COLUMN]: true,
        propertyName: key.toString(),
      };
    }

    const newDescriptor = {
      configurable: false,
      enumerable: true,
      writable: false,
    };

    return {
      ...target,
      extras: [
        {
          descriptor: newDescriptor,
          initializer,
          key: `__knex_object__${key.toString()}`,
          kind: 'field',
          placement: 'static',
        },
      ],
    };
  };
}
