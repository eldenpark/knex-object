const { argv } = require('yargs');
const { createLauncher, proc } = require('process-launch');
const { logger } = require('jege/server');

const log = logger('[monorepo-knex-object]');

const processDefinitions = {
  migrate: proc(
    'node',
    [
      './scripts/migrate.js',
    ],
    {
      cwd: './packages/sandbox',
      stdio: 'inherit',
    },
  ),
  sandbox: proc(
    'node',
    [
      './scripts/launch.js',
      ...argv._,
    ],
    {
      cwd: `./packages/sandbox`,
      stdio: 'inherit',
    },
  ),
};

function launcher() {
  try {
    log(
      'launcher(): Defined processe names: %j, argv: %j',
      Object.keys(processDefinitions),
      argv,
    );

    const Launcher = createLauncher({
      processDefinitions,
    });
    Launcher.run({
      process: argv.process,
    });
  } catch (err) {
    log('launcher(): error launching', err);
  }
}

module.exports = launcher;

if (require.main === module) {
  launcher();
}
