import { readFile } from 'fs/promises';

export async function readJsonFile<T = unknown>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf-8'));
}
