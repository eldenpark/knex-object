import {
  TableIndex,
} from '../entities/KnexEntityTypes';

export interface TableArgs {
  index?: TableIndex[];
  tableName?: string;
}

export interface ClassElement {
  elements: ClassMemberElement[];
  kind: string;
}

export interface ClassMemberElement {
  descriptor: ElementDescriptor;
  initializer: () => any;
  key: string | symbol;
  kind: string;
  placement: string;
}

export interface ElementDescriptor {
  configurable: boolean;
  enumerable: boolean;
  value?: any;
  writable: boolean;
}
