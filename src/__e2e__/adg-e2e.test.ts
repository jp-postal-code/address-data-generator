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
      license: 'MIT',
    }),
    'utf-8'
  );
  const yarnAddResult = spawnSync('yarn', ['add', distDir], {
    encoding: 'utf-8',
    cwd: workDir,
  });
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

test(
  'generate api',
  async () => {
    const generateApiResult = runAdg(['generate', 'api', outputDir], {
      maxBuffer: 1024 * 1024 * 10,
    });

    expect(generateApiResult.output.join('')).toMatch(
      `[SUCCESS] Write addresses json`
    );
    expect(generateApiResult.status).toBe(0);

    const paths = await fastGlob('**/*.json', {
      cwd: outputDir,
    });

    expect(paths.length).toBeGreaterThan(0);

    const minifyResult = runAdg(['minify', `output/**/*.json`], {
      maxBuffer: 1024 * 1024 * 10,
    });

    expect(minifyResult.output.join('')).toMatch('[SUCCESS] Minify');
    expect(minifyResult.status).toBe(0);
  },
  60000 * 5
);

function runAdg(
  args: string[] = [],
  options?: Parameters<typeof spawnSync>['2']
) {
  return spawnSync('yarn', ['adg', ...args], {
    encoding: 'utf-8',
    cwd: workDir,
    ...options,
  });
}
