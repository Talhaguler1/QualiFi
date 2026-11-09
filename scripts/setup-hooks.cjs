const { spawnSync } = require('node:child_process');
const path = require('node:path');
const cwd = path.join(__dirname, '..');
const probe = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' });
if (probe.status !== 0) console.log('No Git checkout found. ZIP users can run npm run quality directly.');
else {
  const result = spawnSync('git', ['config', '--local', 'core.hooksPath', '.githooks'], { cwd, stdio: 'inherit' });
  if (result.status !== 0) process.exitCode = 1;
  else console.log('Repository-local pre-commit quality gate enabled.');
}
