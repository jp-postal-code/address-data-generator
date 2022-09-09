import fastGlob from 'fast-glob';
import { copyFile } from 'fs/promises';
import { join } from 'path';
import { DIST_DIR } from './lib/constants';
import { readJsonFile } from './lib/utils/read-json-file';
import { writeJsonFile } from './lib/utils/write-json-file';

const assets = ['README.md', 'LICENSE'];

async function postBuild() {
  // アセットをコピーする
  for (const entry of await fastGlob(assets, { dot: true })) {
    await copyFile(entry, join(DIST_DIR, entry));
  }

  // package.json から不要なものを削除する
  const packageJson = await readJsonFile<
    Partial<typeof import('../package.json')>
  >('package.json');

  delete packageJson.scripts;
  delete packageJson.devDependencies;

  await writeJsonFile(join(DIST_DIR, 'package.json'), packageJson);
}

postBuild();
