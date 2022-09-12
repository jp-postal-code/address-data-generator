import { KenAllRecord } from '../types/ken-all-record';
import { parseCsv } from '../utils/parse-csv';

export async function* readKenAllRecord(csvPath: string) {
  let address1Fragment = '';
  let address1KanaFragment = '';

  for await (const record of parseCsv<KenAllRecord>(csvPath)) {
    const address1 = record[8];
    const address1Kana = record[5];

    // 町域のカッコが閉じていない場合、町域が次の行にまたがっているものとして扱う
    // または閉じカッコが見つかるまで fragmentedTownArea に追加する
    if (
      /（[^）]+$/.test(address1) ||
      (address1Fragment.length > 0 && !address1.includes('）'))
    ) {
      address1Fragment += address1;
      address1KanaFragment += address1Kana;
      continue;
    }

    if (address1Fragment.length > 0) {
      record[8] = address1Fragment + address1;
      record[5] = address1KanaFragment + address1Kana;

      address1Fragment = '';
      address1KanaFragment = '';
    }

    yield record;
  }
}
