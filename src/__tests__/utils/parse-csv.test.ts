import { KEN_ALL_CSV_FILENAME } from '@/lib/constants';
import { makeTempDir } from '@/lib/utils/make-temp-dir';
import { parseCsv } from '@/lib/utils/parse-csv';
import { test, afterEach, beforeEach, expect } from '@jest/globals';
import { rmSync } from 'fs';
import { writeFile } from 'fs/promises';
import { encode } from 'iconv-lite';
import { join } from 'path';

let workDir: string;

beforeEach(async () => {
  workDir = await makeTempDir();
});

afterEach(() => {
  rmSync(workDir, { force: true, recursive: true });
});

test('parse csv', async () => {
  await writeFile(
    join(workDir, KEN_ALL_CSV_FILENAME),
    encode(
      `01101,"060  ","0600000","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｲｶﾆｹｲｻｲｶﾞﾅｲﾊﾞｱｲ","北海道","札幌市中央区","以下に掲載がない場合",0,0,0,0,0,0
01101,"064  ","0640941","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｱｻﾋｶﾞｵｶ","北海道","札幌市中央区","旭ケ丘",0,0,1,0,0,0
01101,"060  ","0600041","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｵｵﾄﾞｵﾘﾋｶﾞｼ","北海道","札幌市中央区","大通東",0,0,1,0,0,0`,
      'Shift_JIS'
    )
  );

  const generator = parseCsv(join(workDir, KEN_ALL_CSV_FILENAME));

  await expect(generator.next()).resolves.toEqual({
    done: false,
    value: [
      '01101',
      '060  ',
      '0600000',
      'ﾎｯｶｲﾄﾞｳ',
      'ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ',
      'ｲｶﾆｹｲｻｲｶﾞﾅｲﾊﾞｱｲ',
      '北海道',
      '札幌市中央区',
      '以下に掲載がない場合',
      '0',
      '0',
      '0',
      '0',
      '0',
      '0',
    ],
  });
  await expect(generator.next()).resolves.toEqual({
    done: false,
    value: [
      '01101',
      '064  ',
      '0640941',
      'ﾎｯｶｲﾄﾞｳ',
      'ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ',
      'ｱｻﾋｶﾞｵｶ',
      '北海道',
      '札幌市中央区',
      '旭ケ丘',
      '0',
      '0',
      '1',
      '0',
      '0',
      '0',
    ],
  });
  await expect(generator.next()).resolves.toEqual({
    done: false,
    value: [
      '01101',
      '060  ',
      '0600041',
      'ﾎｯｶｲﾄﾞｳ',
      'ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ',
      'ｵｵﾄﾞｵﾘﾋｶﾞｼ',
      '北海道',
      '札幌市中央区',
      '大通東',
      '0',
      '0',
      '1',
      '0',
      '0',
      '0',
    ],
  });
  await expect(generator.next()).resolves.toEqual({
    done: true,
  });
});
