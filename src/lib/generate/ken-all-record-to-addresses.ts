import { REGION_ID_MAP } from '../constants';
import { Address } from '../types/address';
import { KenAllRecord } from '../types/ken-all-record';

export function kenAllRecordToAddresses(record: KenAllRecord): Address[] {
  const regionId = REGION_ID_MAP.get(record[6]);

  if (regionId == null) {
    throw new Error(`"${record[6]}"は不明な都道府県です`);
  }

  const address = removeNonAddressString({
    postalCode: record[2],
    regionId,
    region: record[6],
    locality: record[7],
    address1: record[8],
    address2: '',
    regionKana: record[3].normalize('NFKC'),
    localityKana: record[4].normalize('NFKC'),
    address1Kana: record[5].normalize('NFKC'),
    address2Kana: ''.normalize('NFKC'),
  });

  return [address];
}

function removeNonAddressString(address: Address): Address {
  let { address1, address1Kana } = address;

  // 町域ではない文言の場合は空文字にする
  if (
    /以下に掲載がない場合$/.test(address1) ||
    /.+がくる場合/.test(address1) ||
    /.+一円/.test(address1)
  ) {
    address1 = '';
    address1Kana = '';
  }

  // 以下は住所として使える可能性があるが、一旦消しているもの
  // TODO 住所として使えるものは使う
  if (/[、（～]/.test(address1)) {
    address1 = '';
    address1Kana = '';
  }

  return { ...address, address1, address1Kana };
}
