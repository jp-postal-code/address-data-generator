import { minify } from '@/lib/minify/minify';
import { makeTempDir } from '@/lib/utils/make-temp-dir';
import { afterEach, beforeEach, expect, test } from '@jest/globals';
import { rmSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

let workDir: string;

beforeEach(async () => {
  workDir = await makeTempDir();

  const json = `[
    {
      "postalCode": "0010935",
      "regionId": 1,
      "region": "北海道",
      "locality": "札幌市北区",
      "address1": "新川西五条",
      "address2": "",
      "regionKana": "ホッカイドウ",
      "localityKana": "サッポロシキタク",
      "address1Kana": "シンカワニシ5ジョウ",
      "address2Kana": ""
    }
  ]`;

  mkdir(join(workDir, '001'), { recursive: true });
  await writeFile(join(workDir, '001', '0935.json'), json, 'utf-8');
});

afterEach(() => {
  rmSync(workDir, { force: true, recursive: true });
});

test('minify', async () => {
  const path = join(workDir, '001', '0935.json');
  await minify({ paths: [path] });

  await expect(readFile(path, 'utf-8')).resolves.toBe(
    `[{"postalCode":"0010935","regionId":1,"region":"北海道","locality":"札幌市北区","address1":"新川西五条","address2":"","regionKana":"ホッカイドウ","localityKana":"サッポロシキタク","address1Kana":"シンカワニシ5ジョウ","address2Kana":""}]`
  );
});
