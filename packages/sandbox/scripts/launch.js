/* eslint-disable import/no-extraneous-dependencies */
const { argv } = require('yargs');
const { logger } = require('jege/server');

const babelRc = require('./.babelRc');

const log = logger('[sandbox]');

function launch() {
  log('launch(): argv: %j', argv);

  require('@babel/register')({
    ...babelRc,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  });

  require('../src/server/local.ts');
}

if (require.main === module) {
  launch();
}
