import { KEN_ALL_CSV_FILENAME } from '@/lib/constants';
import { createPostalCodeAddressesMap } from '@/lib/generate/create-postal-code-addresses-map';
import { downloadKenAllZip } from '@/lib/generate/download-ken-all-zip';
import { readKenAllRecord } from '@/lib/generate/read-ken-all-record';
import { writeAddressesJson } from '@/lib/generate/write-addresses-json';
import { makeTempDir } from '@/lib/utils/make-temp-dir';
import { unzip } from '@/lib/utils/unzip';
import { rm } from 'fs/promises';
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

  try {
    const kenAllZipPath = join(tempDir, 'ken_all.zip');
    const kenAllCsvPath = join(tempDir, KEN_ALL_CSV_FILENAME);

    await downloadKenAllZip(kenAllZipPath);

    await unzip(kenAllZipPath, tempDir);

    const postalCodeAddressesMap = await createPostalCodeAddressesMap(
      readKenAllRecord(kenAllCsvPath)
    );

    await writeAddressesJson(postalCodeAddressesMap, distPath, pretty);
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
};
