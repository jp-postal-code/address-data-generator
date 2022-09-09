import { writeFile } from 'fs/promises';

export async function writeJsonFile(path: string, data: unknown) {
  await writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
}
