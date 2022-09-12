import { writeFile } from 'fs/promises';

export async function writeJsonFile(
  path: string,
  data: unknown,
  pretty = true
): Promise<void> {
  await writeFile(path, JSON.stringify(data, null, pretty ? 2 : undefined));
}
