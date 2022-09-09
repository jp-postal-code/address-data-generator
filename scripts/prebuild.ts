import { rm } from 'fs/promises';
import { DIST_DIR } from './lib/constants';

async function preBuild() {
  // dist を削除
  await rm(DIST_DIR, { force: true, recursive: true });
}

preBuild();
