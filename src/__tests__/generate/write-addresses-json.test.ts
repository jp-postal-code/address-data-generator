import { writeAddressesJson } from '@/lib/generate/write-addresses-json';
import { Address } from '@/lib/types/address';
import { makeTempDir } from '@/lib/utils/make-temp-dir';
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

test.each([true, false])(
  'write addresses json: pretty = %s',
  async (pretty) => {
    const postalCodeAddressesMap = new Map<string, Address[]>([
      [
        '0600000',
        [
          {
            postalCode: '0600000',
            regionId: 1,
            region: '北海道',
            locality: '札幌市中央区',
            address1: '',
            address2: '',
            regionKana: 'ホッカイドウ',
            localityKana: 'サッポロシチュウオウク',
            address1Kana: '',
            address2Kana: '',
          },
        ],
      ],
      [
        '0360223',
        [
          {
            postalCode: '0360223',
            regionId: 2,
            region: '青森県',
            locality: '平川市',
            address1: '西野曽江川崎',
            address2: '',
            regionKana: 'アオモリケン',
            localityKana: 'ヒラカワシ',
            address1Kana: 'ニシノゾエカワサキ',
            address2Kana: '',
          },
          {
            postalCode: '0360223',
            regionId: 2,
            region: '青森県',
            locality: '平川市',
            address1: '西野曽江橋元',
            address2: '',
            regionKana: 'アオモリケン',
            localityKana: 'ヒラカワシ',
            address1Kana: 'ニシノゾエハシモト',
            address2Kana: '',
          },
          {
            postalCode: '0360223',
            regionId: 2,
            region: '青森県',
            locality: '平川市',
            address1: '西野曽江広田',
            address2: '',
            regionKana: 'アオモリケン',
            localityKana: 'ヒラカワシ',
            address1Kana: 'ニシノゾエヒロタ',
            address2Kana: '',
          },
        ],
      ],
    ]);

    await writeAddressesJson({
      postalCodeAddressesMap,
      distPath: workDir,
      pretty,
    });

    await expect(
      readFile(join(workDir, '060', '0000.json'), 'utf-8')
    ).resolves.toMatchSnapshot();

    await expect(
      readFile(join(workDir, '036', '0223.json'), 'utf-8')
    ).resolves.toMatchSnapshot();
  }
);
