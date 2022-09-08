import { test, beforeAll, beforeEach, expect } from '@jest/globals';
import { spawnSync } from 'child_process';
import { rmSync } from 'fs';
import { join } from 'path';

const adgJsPath = join(process.cwd(), 'dist/bin/adg.js');
const outputDir = join(process.cwd(), 'tmp/e2e');

beforeAll(() => {
  const result = spawnSync('yarn', ['build'], { encoding: 'utf-8' });
  expect(result.status).toBe(0);
  console.log(result.stdout);
});

beforeEach(() => {
  rmSync(outputDir, { force: true, recursive: true });
});

test('show help and exit code 1', () => {
  const result = spawnSync('node', [adgJsPath], { encoding: 'utf-8' });

  expect(result.status).toBe(1);
  expect(result.stderr).toMatch('Usage: adg [options] [command]');
  expect(result.stderr).toMatchSnapshot();
});

test('generate api', () => {
  const result = spawnSync('node', [adgJsPath, 'generate', 'api', outputDir], {
    encoding: 'utf-8',
  });

  expect(result.status).toBe(1);
  expect(result.stderr).toMatch('not implemented.');
});

test('minify', () => {
  const result = spawnSync('node', [adgJsPath, 'minify', outputDir], {
    encoding: 'utf-8',
  });

  expect(result.status).toBe(1);
  expect(result.stderr).toMatch('not implemented.');
});
