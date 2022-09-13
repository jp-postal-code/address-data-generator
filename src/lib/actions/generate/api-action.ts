import { KEN_ALL_CSV_FILENAME } from '@/lib/constants';
import { createPostalCodeAddressesMap } from '@/lib/generate/create-postal-code-addresses-map';
import { downloadKenAllZip } from '@/lib/generate/download-ken-all-zip';
import { readKenAllRecord } from '@/lib/generate/read-ken-all-record';
import { writeAddressesJson } from '@/lib/generate/write-addresses-json';
import { Address } from '@/lib/types/address';
import { makeTempDir } from '@/lib/utils/make-temp-dir';
import { unzip } from '@/lib/utils/unzip';
import { rm } from 'fs/promises';
import { Listr } from 'listr2';
import { join } from 'path';
import { Action } from '../../types/action';

interface Options {
  pretty: boolean;
}

export const defaultOptions = {
  pretty: false,
};

export const apiAction: Action<[string], Options> = async (
  distPath,
  { pretty }
) => {
  const tempDir = await makeTempDir();
  const kenAllZipPath = join(tempDir, 'ken_all.zip');
  const kenAllCsvPath = join(tempDir, KEN_ALL_CSV_FILENAME);

  try {
    const tasks = createListr({
      distPath,
      pretty,
      tempDir,
      kenAllZipPath,
      kenAllCsvPath,
    });
    await tasks.run();
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
};

interface Context {
  distPath: string;
  pretty: boolean;
  tempDir: string;
  kenAllZipPath: string;
  kenAllCsvPath: string;
  postalCodeAddressesMap?: Map<string, Address[]>;
}

function createListr(context: Context): Listr<Context> {
  return new Listr<Context>(
    [
      {
        title: 'Download "ken-all.zip".',
        async task({ kenAllZipPath }) {
          await downloadKenAllZip(kenAllZipPath);
        },
      },
      {
        title: 'Unzip "ken-all.zip',
        async task({ kenAllZipPath, tempDir }) {
          await unzip(kenAllZipPath, tempDir);
        },
      },
      {
        title: 'Create postal code addresses map',
        async task(context) {
          const { kenAllCsvPath } = context;
          const postalCodeAddressesMap = await createPostalCodeAddressesMap(
            readKenAllRecord(kenAllCsvPath)
          );
          context.postalCodeAddressesMap = postalCodeAddressesMap;
        },
      },
      {
        title: 'Write addresses json',
        async task({ postalCodeAddressesMap, distPath, pretty }, task) {
          if (postalCodeAddressesMap == null) {
            task.skip();
            return;
          }

          let completedCount = 0;
          await writeAddressesJson({
            postalCodeAddressesMap,
            distPath,
            pretty,
            onOutput() {
              ++completedCount;
              task.output = `${completedCount}/${postalCodeAddressesMap.size}`;
            },
          });
        },
      },
    ],
    {
      ctx: context,
      concurrent: false,
    }
  );
}
