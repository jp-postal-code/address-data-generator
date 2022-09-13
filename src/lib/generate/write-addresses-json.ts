import { Address } from '../types/address';
import { PromisePool } from '@supercharge/promise-pool';
import { writeJsonFile } from '../utils/write-json-file';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

interface Params {
  postalCodeAddressesMap: Map<string, Address[]>;
  distPath: string;
  pretty: boolean;

  onOutput?(path: string): void;
}

export async function writeAddressesJson({
  postalCodeAddressesMap,
  distPath,
  pretty,
  onOutput,
}: Params): Promise<void> {
  await PromisePool.for([...postalCodeAddressesMap.entries()])
    .withConcurrency(50)
    .handleError((error) => {
      throw error;
    })
    .process(async ([postalCode, addresses]) => {
      const outputPath = join(
        distPath,
        postalCode.substring(0, 3),
        `${postalCode.substring(3)}.json`
      );

      await mkdir(dirname(outputPath), { recursive: true });

      await writeJsonFile(outputPath, addresses, pretty);

      onOutput?.(outputPath);
    });
}
