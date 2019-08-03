import {
  IS_COLUMN,
} from '../constants';

export interface EntityDefinition {
  columns: {
    [columnName: string]: ColumnType;
  };
  index?: TableIndex[];
  tableName?: string;
}

export interface TableIndex {
  columns: string[];
  key?: string;
}

export type ColumnType = {
  columnDefinition: ColumnDefinition;
  entityName: string;
  [IS_COLUMN]: true;
  propertyName: string;
};

export interface ColumnDefinition {
  comment?: [string];
  defaultTo?: [any];
  index?: [string?];
  notNullable?: boolean;
  primary?: boolean;
  type: DataType;
  unique?: boolean;
}

export type DataType
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
