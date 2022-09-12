import { Address } from '../types/address';
import { KenAllRecord } from '../types/ken-all-record';
import { isUniqueFactory } from '../utils/is-unique';
import { kenAllRecordToAddresses } from './ken-all-record-to-addresses';

export async function createPostalCodeAddressesMap(
  kenAllRecordGenerator: AsyncGenerator<KenAllRecord>
): Promise<Map<string, Address[]>> {
  const result = new Map<string, Address[]>();
  const isUnique = isUniqueAddressFactory();

  for await (const record of kenAllRecordGenerator) {
    const addresses = kenAllRecordToAddresses(record);

    for (const address of addresses) {
      if (!isUnique(address)) {
        continue;
      }

      const mapValue = result.get(address.postalCode) ?? [];

      mapValue.push(address);

      result.set(address.postalCode, mapValue);
    }
  }

  return result;
}

function isUniqueAddressFactory() {
  const isUnique = isUniqueFactory<string>();

  return (address: Address) => isUnique(Object.values(address).join('_'));
}
