import { downloadKenAllZip } from '@/lib/generate/download-ken-all-zip';
import { beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import { readFile } from 'fs/promises';
import https from 'https';
import { IncomingMessage } from 'http';
import { join } from 'path';
import { makeTempDir } from '@/lib/utils/make-temp-dir';
import { rmSync } from 'fs';

let workDir: string;

beforeEach(async () => {
  workDir = await makeTempDir();
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
}, 30000);

test('throws error if status code is not 200', async () => {
  jest.spyOn(https, 'get').mockImplementation(((
    url: string,
    callback: (res: IncomingMessage) => void
  ) => {
    callback({
      statusCode: 500,
      statusMessage: 'INTERNAL SERVER ERROR',
      pause() {
        return this;
      },
      resume() {
        return this;
      },
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
