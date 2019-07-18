/* eslint-disable */
import { logger } from 'jege/server';

const log = logger('[knex-object]');

export function Column(tag) {
  // `...args` to prevent TypeScript warning which has different decorator spec
  return function ColumnDecorator(target, ...args) { // eslint-disable-line
    log('ColumnDecorator(): target: %o', target);

    // console.log(555, this);
    const { kind, key, descriptor } = target;
    const { value } = descriptor;
    // const a = target.initializer();
    // console.log(333, a);

    function initializer() {
      console.log('444444 initializer', this.__tableDefinition);
      this.__tableDefinition[key] = tag;
      return {
        __generatedFieldNotTobeUsed: 0,
      };
    }

    const boundTarget = { ...descriptor, value: undefined };

    return {
      ...target,
      extras: [
        {
          descriptor: boundTarget,
          initializer,
          key,
          kind: 'field',
          placement: 'static',
        },
      ],
    };
  };
}
