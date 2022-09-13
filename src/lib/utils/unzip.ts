import { readFile, writeFile } from 'fs/promises';
import JSZip from 'jszip';
import { join } from 'path';

export async function unzip(zipPath: string, outputDir: string): Promise<void> {
  const zip = await new JSZip().loadAsync(readFile(zipPath));

  for (const filePath of Object.keys(zip.files)) {
    const file = zip.files[filePath];

    await writeFile(join(outputDir, filePath), await file.async('nodebuffer'));
  }
}
