const { argv } = require('yargs');
const childProcess = require('child_process');
const { logger } = require('jege/server');

const log = logger('[monorepo-knex-object]');

const processDefinitions = {
  migrate: [
    'node',
    [
      './scripts/migrate.js',
    ],
    {
      cwd: './packages/sandbox',
      stdio: 'inherit',
    },
  ],
  sandbox: [
    'node',
    [
      './scripts/launch.js',
      ...argv._,
    ],
    {
      cwd: `./packages/sandbox`,
      stdio: 'inherit',
    },
  ],
};

function launcher() {
  try {
    log(
      'launcher(): Defined processe names: %j, argv: %j',
      Object.keys(processDefinitions),
      argv,
    );

    if (argv.process) {
      log('launcher(): starting only this process: %s', argv.process);
      const processDefinition = processDefinitions[argv.process];
      childProcess.spawn(...processDefinition);
    } else {
      Object.entries(processDefinitions)
        .forEach(([processName, processDefinition]) => {
          log('launcher(): starting processName: %s', processName);
          childProcess.spawn(...processDefinition);
        });
    }
  } catch (err) {
    log('launcher(): error reading file', err);
  }
}

module.exports = launcher;

if (require.main === module) {
  launcher();
}
