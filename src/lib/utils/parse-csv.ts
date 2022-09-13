// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { decodeStream } from 'iconv-lite';

export async function* parseCsv<T extends unknown[]>(
  csvPath: string
): AsyncGenerator<T> {
  const stream = createReadStream(csvPath)
    .pipe(decodeStream('Shift_JIS'))
    .pipe(parse());

  for await (const record of stream) {
    yield record;
  }
}
