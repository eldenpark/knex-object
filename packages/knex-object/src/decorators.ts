// import { logger } from 'jege/server';

import {
  TABLE_DEFINITION,
  TABLE_INDEX,
} from './constants';

// const log = logger('[knex-object]');
// @Table({})
// class A {
//   @Column({
//     type: ['string', [12]],
//   })
//   p;
// }

export function Column(columnArgs: ColumnArgs) {
  // `...args` to prevent TypeScript warning which has different decorator spec
  return function ColumnDecorator(target, ...args) { // eslint-disable-line
    console.log('ColumnDecorator(): target: %o', target);

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

    function initializer() {
      console.log('444444 initializer', this[TABLE_DEFINITION]);
      this[TABLE_DEFINITION][key] = columnArgs;
      return {
        __generatedFieldNotTobeUsed: 0,
      };
    }

    const newDescriptor = {
      configurable: false,
      enumerable: false,
      value: undefined,
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
    console.log(111111, target);

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
        this[TABLE_DEFINITION][TABLE_INDEX] = {
          a: 1,
        };
        return index;
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

interface ColumnArgs {
  comment?: string;
  defaultTo?: any;
  notNullable?: boolean;
  primary?: boolean;
  type: DataType;
  unique?: boolean;
}

type DataType
= BigIntegerType
| BooleanType
| DateTimeType
| EnumDataType
| FloatDataType
| IncrementsType
| IntegerType
| StringDataType
| TextType
| TimestampType;

type BigIntegerType = ['bigInteger'];
type BooleanType = ['boolean'];
type DateTimeType = ['datetime'];
type EnumDataType = ['enu', [string[]]];
type FloatDataType = ['float', [number?, number?]?];
type IncrementsType = ['increments'];
type IntegerType = ['integer'];
type StringDataType = ['string', [number?]?];
type TextType = ['text'];
type TimestampType = ['timestamp'];

interface TableArgs {
  index?;
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
