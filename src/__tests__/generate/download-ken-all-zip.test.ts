import { downloadKenAllZip } from '@/lib/generate/download-ken-all-zip';
import { beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import { readFile } from 'fs/promises';
import https from 'https';
import { IncomingMessage } from 'http';
import { mkdtempSync, rmSync } from 'fs';
import { join } from 'path';

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync('adg-test');
});

afterEach(() => {
  rmSync(workDir, { force: true, recursive: true });
  jest.restoreAllMocks();
});

test('download ken all', async () => {
  const path = join(workDir, 'ken-all.zip');
  await downloadKenAllZip(path);

  const buffer = await readFile(path);

  // zip のヘッダーと一致するべき
  expect(buffer.readUInt32LE()).toBe(0x04034b50);
});

test('throws error if status code is not 200', async () => {
  jest.spyOn(https, 'get').mockImplementation(((
    url: string,
    callback: (res: IncomingMessage) => void
  ) => {
    callback({
      statusCode: 500,
      statusMessage: 'INTERNAL SERVER ERROR',
    } as IncomingMessage);

    return {
      on: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any);

  await expect(downloadKenAllZip(join(workDir, 'ken-all.zip'))).rejects.toThrow(
    'KEN_ALL.zip ファイルのダウンロードに失敗しました\nStatus code: 500'
  );
});
