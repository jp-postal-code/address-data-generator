import { KEN_ALL_CSV_FILENAME } from '@/lib/constants';
import { downloadKenAllZip } from '@/lib/generate/download-ken-all-zip';
import { unzip } from '@/lib/utils/unzip';
import { test, afterEach, beforeEach, expect } from '@jest/globals';
import { mkdtempSync, rmSync } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync('adg-test');
});

afterEach(() => {
  rmSync(workDir, { force: true, recursive: true });
});

test('unzip', async () => {
  const zipPath = join(workDir, 'ken-all.zip');
  await downloadKenAllZip(zipPath);

  await unzip(zipPath, workDir);

  await expect(readdir(workDir)).resolves.toEqual([
    KEN_ALL_CSV_FILENAME,
    'ken-all.zip',
  ]);
});
