// @ts-check

const just = require('just-task');
const { task, series, parallel, condition, option, argv, logger, addResolvePath } = just;

const path = require('path');
const fs = require('fs');

const { clean } = require('./tasks/clean');
const { copy } = require('./tasks/copy');
const { jest, jestWatch } = require('./tasks/jest');
const { sass } = require('./tasks/sass');
const { ts } = require('./tasks/ts');
const { tslint } = require('./tasks/tslint');
const { webpack, webpackDevServer } = require('./tasks/webpack');
const { verifyApiExtractor, updateApiExtractor } = require('./tasks/api-extractor');
const lintImports = require('./tasks/lint-imports');
const prettier = require('./tasks/prettier');
const bundleSizeCollect = require('./tasks/bundle-size-collect');
const checkForModifiedFiles = require('./tasks/check-for-modified-files');
const generateVersionFiles = require('./tasks/generate-version-files');
const perfTest = require('./tasks/perf-test');

let packageJson;

function preset() {
  // this add s a resolve path for the build tooling deps like TS from the scripts folder
  addResolvePath(__dirname);

  option('production');

  // Adds an alias for 'npm-install-mode' for backwards compatibility
  option('min', { alias: 'npm-install-mode' });

  option('webpackConfig', { alias: 'w' });

  // Build only commonjs (not other TS variants) but still run other tasks
  option('commonjs');

  registerTask('clean', clean);
  registerTask('copy', copy);
  registerTask('jest', jest);
  registerTask('jest-watch', jestWatch);
  registerTask('sass', sass);
  registerTask('ts:commonjs', ts.commonjs);
  registerTask('ts:esm', ts.esm);
  registerTask('ts:amd', ts.amd);
  registerTask('tslint', tslint);
  registerTask('ts:commonjs-only', ts.commonjsOnly);
  registerTask('webpack', webpack);
  registerTask('webpack-dev-server', webpackDevServer);
  registerTask('verify-api-extractor', verifyApiExtractor);
  registerTask('update-api-extractor', updateApiExtractor);
  registerTask('lint-imports', lintImports);
  registerTask('prettier', prettier);
  registerTask('bundle-size-collect', bundleSizeCollect);
  registerTask('check-for-modified-files', checkForModifiedFiles);
  registerTask('generate-version-files', generateVersionFiles);
  registerTask('perf-test', perfTest);

  task('ts', parallel('ts:commonjs', 'ts:esm', condition('ts:amd', () => argv().production && !argv().min)));

  task(
    'build',
    series(
      'clean',
      'copy',
      'sass',
      parallel(
        condition('tslint', () => !argv().min),
        condition('jest', () => !argv().min),
        series(
          argv().commonjs ? 'ts:commonjs-only' : 'ts',
          condition('lint-imports', () => !argv().min),
          // verify-api-extractor must always be run now because the api-docs package depends on its output
          parallel(condition('webpack', () => !argv().min), 'verify-api-extractor')
        )
      )
    )
  );

  // Special case build for the serializer, which needs to absolutely run typescript and jest serially.
  task('build-jest-serializer-merge-styles', series('ts', 'jest'));

  task('build-commonjs-only', series('clean', 'ts:commonjs-only'));
  task('code-style', series('prettier', 'tslint'));
  task('update-api', series('clean', 'copy', 'sass', 'ts', 'update-api-extractor'));
  task('dev', series('clean', 'copy', 'sass', 'webpack-dev-server'));
}

module.exports = preset;
preset.just = just;

// Utility functions

function getPackage() {
  if (packageJson) {
    return packageJson;
  }

  let packagePath = path.resolve(process.cwd(), 'package.json');

  if (fs.existsSync(packagePath)) {
    packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson;
  }

  return undefined;
}

function getDisabledTasks() {
  const pkgJson = getPackage();
  return (pkgJson && pkgJson.disabledTasks) || [];
}

function registerTask(name, taskFunction) {
  const disabledTasks = getDisabledTasks();

  task(
    name,
    disabledTasks.includes(name)
      ? () => {
          logger.info(`${name} task is disabled in package.json`);
        }
      : taskFunction
  );
}
