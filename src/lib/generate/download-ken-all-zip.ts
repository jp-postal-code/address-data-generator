import { writeFile } from 'fs/promises';
import { KEN_ALL_ZIP_URL } from '../constants';
import { fetch } from '@/lib/utils/fetch';

/**
 * @returns ダウンロードファイルのパス
 */
export async function downloadKenAllZip(path: string): Promise<void> {
  const response = await fetch(KEN_ALL_ZIP_URL);

  if (response.statusCode !== 200) {
    throw new Error(
      `KEN_ALL.zip ファイルのダウンロードに失敗しました\nStatus code: ${response.statusCode}`
    );
  }

  const body = await response.body();

  await writeFile(path, body);
}
