import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool';
import { readFile, writeFile } from 'fs/promises';
import { minifyJson } from '../utils/minify-json';

interface Params {
  paths: string[];
  onMinified?: (path: string) => void;
}

export async function minify({ paths, onMinified }: Params): Promise<void> {
  await PromisePool.for(paths)
    .withConcurrency(50)
    .handleError((error) => {
      throw error;
    })
    .process(async (path) => {
      const content = await readFile(path, 'utf-8');

      await writeFile(path, minifyJson(content), 'utf-8');

      onMinified?.(path);
    });
}
