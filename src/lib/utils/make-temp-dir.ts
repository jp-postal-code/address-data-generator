import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

export async function makeTempDir(): Promise<string> {
  return await mkdtemp(join(tmpdir(), 'adg-'));
}
