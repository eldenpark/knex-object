import { EntityDefinition } from './entities/KnexEntityTypes';

export function toSnakeCase(str): string {
  return str.replace(/(?:^|\.?)([A-Z])/g, (x, y) => '_' + y.toLowerCase())
    .replace(/^_/, '');
}

export function requireNonNull(obj: any, message?: string) {
  if (obj === undefined || obj === null) {
    console.log('requireNonNull(): %s', message); // eslint-disable-line no-console
  }
}

export function getPrintableEntityDefinition(
  entityDefinition: EntityDefinition,
): EntityDefinition {
  const seen = new WeakSet();
  function inspect(obj) {
    if (typeof obj === 'object' && obj !== null) {
      if (seen.has(obj)) {
        return '[circular]';
      }

      if (obj.constructor.name === 'Raw' ) {
        return '[knexProperty]';
      }

      seen.add(obj);
      const _result = {};
      Object.entries(obj)
        .forEach(([key, value]) => {
          _result[key] = inspect(value);
        });
      return _result;
    }
    return obj;
  }

  return inspect(entityDefinition) as EntityDefinition;
}
