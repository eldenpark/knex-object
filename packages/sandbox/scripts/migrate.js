/* eslint-disable import/no-extraneous-dependencies */
const { argv } = require('yargs');
const chalk = require('chalk');
const { logger } = require('jege/server');

const babelRc = require('./.babelrc');

const log = logger('[sandbox]');

require('@babel/register')({
  ...babelRc,
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
});

const knex = require('../src/knex').default;
const { down, up } = require('../src/persistence/migrations');

async function launchMigrate() {
  log('launchMigrate(): argv: %j, cwd: %s', argv, process.cwd());

  try {
    const downResult = await down(knex);
    log(
      `launchMigrate(): ${chalk.green('success')} down(), up will follow. Command count: %s`,
      downResult.length,
    );

    const upResult = await up(knex);
    log(
      `launchMigrate(): ${chalk.green('success')} up. Command count: %s`,
      upResult.length,
    );
    process.exit(0);
  } catch (err) {
    log(`launchMigrate(): ${chalk.red('error')}: %o`, err);
  }
}

if (require.main === module) {
  launchMigrate();
}
