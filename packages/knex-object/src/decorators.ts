import { logger } from 'jege/server';

const log = logger('[knex-object]');

// Column({
//   type: ['string', [12]],
// });

export function Column(columnArgs: ColumnArgs) {
  // `...args` to prevent TypeScript warning which has different decorator spec
  return function ColumnDecorator(target, ...args) { // eslint-disable-line
    log('ColumnDecorator(): target: %o', target);
    const {
      key,
      kind,
      placement,
    } = target;

    if (kind !== 'field') {
      throw new Error(`ColumnDecorator(): '@Column' should be put onto field`);
    }

    if (placement !== 'own') {
      throw new Error(`ColumnDecorator(): '@Column' should be put onto instance variable`);
    }

    function initializer() {
      console.log('444444 initializer', this.__tableDefinition);
      this.__tableDefinition[key] = columnArgs;
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
type StringDataType = ['string', [number?]];
type TextType = ['text'];
type TimestampType = ['timestamp'];
