import { test, beforeAll, beforeEach, expect } from '@jest/globals';
import { spawnSync } from 'child_process';
import fastGlob from 'fast-glob';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const workDir = join(process.cwd(), 'tmp/e2e');
const outputDir = join(workDir, 'output');

beforeAll(() => {
  // インストールする
  rmSync(workDir, { force: true, recursive: true });
  mkdirSync(workDir, { recursive: true });
  writeFileSync(
    join(workDir, 'package.json'),
    JSON.stringify({
      name: 'address-data-generator-e2e',
      license: 'none',
    }),
    'utf-8'
  );
  const yarnAddResult = spawnSync('yarn', ['add', distDir], {
    encoding: 'utf-8',
    cwd: workDir,
  });
  expect(yarnAddResult.output.join(''));
  expect(yarnAddResult.status).toBe(0);
});

beforeEach(() => {
  rmSync(outputDir, { force: true, recursive: true });
});

test('show help and exit code 1', () => {
  const result = runAdg();

  expect(result.status).toBe(1);
  expect(result.stderr).toMatch('Usage: adg [options] [command]');
  expect(result.stderr).toMatchSnapshot();
});

test('generate api', async () => {
  const result = runAdg(['generate', 'api', outputDir]);

  expect(result.status).toBe(0);

  const paths = await fastGlob('**/*.json', {
    cwd: outputDir,
  });

  expect(paths.length).toBeGreaterThan(0);
}, 60000);

test('minify', () => {
  const result = runAdg(['minify']);

  expect(result.status).toBe(1);
  expect(result.stderr).toMatch('not implemented.');
});

function runAdg(args: string[] = []) {
  return spawnSync('yarn', ['adg', ...args], {
    encoding: 'utf-8',
    cwd: workDir,
  });
}
