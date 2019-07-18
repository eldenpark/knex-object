const { logger } = require('./log');

const log = logger('[knex-object]');

exports.requireNonNull = (obj, message) => {
  if (obj === undefined || obj === null) {
    log(message);
    process.exit(0);
  }
};
