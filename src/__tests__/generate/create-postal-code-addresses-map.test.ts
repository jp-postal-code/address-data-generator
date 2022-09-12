import { createPostalCodeAddressesMap } from '@/lib/generate/create-postal-code-addresses-map';
import { Address } from '@/lib/types/address';
import { KenAllRecord } from '@/lib/types/ken-all-record';
import { expect, test } from '@jest/globals';

test('returns map', async () => {
  const map = await createPostalCodeAddressesMap(mockRecordGenerator());

  expect([...map.keys()]).toEqual(['0600000', '0360223']);

  expect(map.get('0600000')).toEqual([
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
  ] as Address[]);

  expect(map.get('0360223')).toEqual([
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
  ] as Address[]);
});

async function* mockRecordGenerator(): AsyncGenerator<KenAllRecord> {
  yield [
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
  ];
  yield [
    '02210',
    '03602',
    '0360223',
    'ｱｵﾓﾘｹﾝ',
    'ﾋﾗｶﾜｼ',
    'ﾆｼﾉｿﾞｴｶﾜｻｷ',
    '青森県',
    '平川市',
    '西野曽江川崎',
    '0',
    '1',
    '0',
    '1',
    '0',
    '0',
  ];
  yield [
    '02210',
    '03602',
    '0360223',
    'ｱｵﾓﾘｹﾝ',
    'ﾋﾗｶﾜｼ',
    'ﾆｼﾉｿﾞｴﾊｼﾓﾄ',
    '青森県',
    '平川市',
    '西野曽江橋元',
    '0',
    '1',
    '0',
    '1',
    '0',
    '0',
  ];
  yield [
    '02210',
    '03602',
    '0360223',
    'ｱｵﾓﾘｹﾝ',
    'ﾋﾗｶﾜｼ',
    'ﾆｼﾉｿﾞｴﾋﾛﾀ',
    '青森県',
    '平川市',
    '西野曽江広田',
    '0',
    '1',
    '0',
    '1',
    '0',
    '0',
  ];
}
