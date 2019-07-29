export function toSnakeCase(str): string {
  return str.replace(/(?:^|\.?)([A-Z])/g, (x, y) => '_' + y.toLowerCase())
    .replace(/^_/, '');
}

export function requireNonNull(obj: any, message?: string) {
  if (obj === undefined || obj === null) {
    console.log('requireNonNull(): %s', message); // eslint-disable-line no-console
  }
}
