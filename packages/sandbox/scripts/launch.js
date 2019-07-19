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

  const { default: main } = require('../src/main');
  main()
    .then((result) => {
      log('launch(): process ends with result: %s', result);
      process.exit(0);
    });
}

if (require.main === module) {
  launch();
}
