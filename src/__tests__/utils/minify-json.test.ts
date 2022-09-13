import { minifyJson } from '@/lib/utils/minify-json';
import { expect, test } from '@jest/globals';

test('minify json', () => {
  const json = minifyJson(`[
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
  ]`);

  expect(json).toBe(
    `[{"postalCode":"0010935","regionId":1,"region":"北海道","locality":"札幌市北区","address1":"新川西五条","address2":"","regionKana":"ホッカイドウ","localityKana":"サッポロシキタク","address1Kana":"シンカワニシ5ジョウ","address2Kana":""}]`
  );
  expect(JSON.parse(json)).toEqual([
    {
      postalCode: '0010935',
      regionId: 1,
      region: '北海道',
      locality: '札幌市北区',
      address1: '新川西五条',
      address2: '',
      regionKana: 'ホッカイドウ',
      localityKana: 'サッポロシキタク',
      address1Kana: 'シンカワニシ5ジョウ',
      address2Kana: '',
    },
  ]);
});
