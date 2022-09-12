import { makeTempDir } from '@/lib/utils/make-temp-dir';
import { writeJsonFile } from '@/lib/utils/write-json-file';
import { afterEach, beforeEach, expect, test } from '@jest/globals';
import { rmSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

let workDir: string;

beforeEach(async () => {
  workDir = await makeTempDir();
});

afterEach(() => {
  rmSync(workDir, { force: true, recursive: true });
});

test('write json', async () => {
  const path = join(workDir, 'test.json');

  await writeJsonFile(path, {
    a: 'value',
  });

  expect(await readFile(path, 'utf-8')).toBe(`{
  "a": "value"
}`);

  await writeJsonFile(
    path,
    {
      a: 'value',
    },
    false
  );

  expect(await readFile(path, 'utf-8')).toBe(`{"a":"value"}`);
});
