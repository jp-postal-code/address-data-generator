import { kenAllRecordToAddresses } from '@/lib/generate/ken-all-record-to-addresses';
import { Address } from '@/lib/types/address';
import { test, expect } from '@jest/globals';

test('returns address', () => {
  expect(
    kenAllRecordToAddresses([
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
    ])
  ).toEqual([
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

  expect(
    kenAllRecordToAddresses([
      '37403',
      '766  ',
      '7660002',
      'ｶｶﾞﾜｹﾝ',
      'ﾅｶﾀﾄﾞｸﾞﾝｺﾄﾋﾗﾁｮｳ',
      'ｺﾄﾋﾗﾁｮｳﾉﾂｷﾞﾆ1-426ﾊﾞﾝﾁｶﾞｸﾙﾊﾞｱｲ(ｶﾜﾋｶﾞｼ)',
      '香川県',
      '仲多度郡琴平町',
      '琴平町の次に１～４２６番地がくる場合（川東）',
      '1',
      '0',
      '0',
      '0',
      '0',
      '0',
    ])
  ).toEqual([
    {
      postalCode: '7660002',
      regionId: 37,
      region: '香川県',
      locality: '仲多度郡琴平町',
      address1: '',
      address2: '',
      regionKana: 'カガワケン',
      localityKana: 'ナカタドグンコトヒラチョウ',
      address1Kana: '',
      address2Kana: '',
    },
  ] as Address[]);

  expect(
    kenAllRecordToAddresses([
      '39303',
      '78164',
      '7816410',
      'ｺｳﾁｹﾝ',
      'ｱｷｸﾞﾝﾀﾉﾁｮｳ',
      'ﾀﾉﾁｮｳｲﾁｴﾝ',
      '高知県',
      '安芸郡田野町',
      '田野町一円',
      '0',
      '0',
      '0',
      '0',
      '0',
      '0',
    ])
  ).toEqual([
    {
      postalCode: '7816410',
      regionId: 39,
      region: '高知県',
      locality: '安芸郡田野町',
      address1: '',
      address2: '',
      regionKana: 'コウチケン',
      localityKana: 'アキグンタノチョウ',
      address1Kana: '',
      address2Kana: '',
    },
  ] as Address[]);

  expect(
    kenAllRecordToAddresses([
      '03366',
      '02955',
      '0295503',
      'ｲﾜﾃｹﾝ',
      'ﾜｶﾞｸﾞﾝﾆｼﾜｶﾞﾏﾁ',
      'ｱﾅｱｹ22ﾁﾜﾘ､ｱﾅｱｹ23ﾁﾜﾘ',
      '岩手県',
      '和賀郡西和賀町',
      '穴明２２地割、穴明２３地割',
      '0',
      '0',
      '0',
      '1',
      '0',
      '0',
    ])
  ).toEqual([
    {
      postalCode: '0295503',
      regionId: 3,
      region: '岩手県',
      locality: '和賀郡西和賀町',
      address1: '',
      address2: '',
      regionKana: 'イワテケン',
      localityKana: 'ワガグンニシワガマチ',
      address1Kana: '',
      address2Kana: '',
    },
  ] as Address[]);

  expect(
    kenAllRecordToAddresses([
      '01101',
      '060  ',
      '0600042',
      'ﾎｯｶｲﾄﾞｳ',
      'ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ',
      'ｵｵﾄﾞｵﾘﾆｼ(1-19ﾁｮｳﾒ)',
      '北海道',
      '札幌市中央区',
      '大通西（１～１９丁目）',
      '1',
      '0',
      '1',
      '0',
      '0',
      '0',
    ])
  ).toEqual([
    {
      postalCode: '0600042',
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

  expect(
    kenAllRecordToAddresses([
      '03366',
      '02955',
      '0295523',
      'ｲﾜﾃｹﾝ',
      'ﾜｶﾞｸﾞﾝﾆｼﾜｶﾞﾏﾁ',
      'ｴｯﾁｭｳﾊﾀ64ﾁﾜﾘ-ｴｯﾁｭｳﾊﾀ66ﾁﾜﾘ',
      '岩手県',
      '和賀郡西和賀町',
      '越中畑６４地割～越中畑６６地割',
      '0',
      '0',
      '0',
      '1',
      '0',
      '0',
    ])
  ).toEqual([
    {
      postalCode: '0295523',
      regionId: 3,
      region: '岩手県',
      locality: '和賀郡西和賀町',
      address1: '',
      address2: '',
      regionKana: 'イワテケン',
      localityKana: 'ワガグンニシワガマチ',
      address1Kana: '',
      address2Kana: '',
    },
  ] as Address[]);
});

test('throws error if unknown region', () => {
  expect(() =>
    kenAllRecordToAddresses([
      '01101',
      '060  ',
      '0600000',
      'ﾎｯｶｲﾄﾞｳ',
      'ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ',
      'ｲｶﾆｹｲｻｲｶﾞﾅｲﾊﾞｱｲ',
      'ほげ',
      '札幌市中央区',
      '以下に掲載がない場合',
      '0',
      '0',
      '0',
      '0',
      '0',
      '0',
    ])
  ).toThrow('"ほげ"は不明な都道府県です');
});
