import { test, beforeAll, beforeEach, expect } from '@jest/globals';
import { spawnSync } from 'child_process';
import { rmSync } from 'fs';

const outputDir = 'tmp/e2e';

beforeAll(() => {
  spawnSync('yarn', ['build']);
});

beforeEach(() => {
  rmSync(outputDir, { force: true, recursive: true });
});

test('show help and exit code 1', () => {
  const result = spawnSync('node', ['dist/bin/adg.js'], { encoding: 'utf-8' });

  expect(result.status).toBe(1);
  expect(result.stderr).toMatch('Usage: adg [options] [command]');
  expect(result.stderr).toMatchSnapshot();
});

test('generate api', () => {
  const result = spawnSync(
    'node',
    ['dist/bin/adg.js', 'generate', 'api', outputDir],
    { encoding: 'utf-8' }
  );

  expect(result.status).toBe(1);
  expect(result.stderr).toMatch('not implemented.');
});

test('minify', () => {
  const result = spawnSync('node', ['dist/bin/adg.js', 'minify', outputDir], {
    encoding: 'utf-8',
  });

  expect(result.status).toBe(1);
  expect(result.stderr).toMatch('not implemented.');
});
