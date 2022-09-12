import { IncomingMessage } from 'http';
import { get } from 'https';

interface Response {
  statusCode: number;
  statusMessage: string;
  body(): Promise<Buffer>;
}

export function fetch(url: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    const req = get(url, (res) => {
      if (res.statusCode == null || res.statusMessage == null) {
        reject(
          new Error(
            `unknown status code: ${res.statusCode} ${res.statusMessage}`
          )
        );
        return;
      }

      resolve({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        body: bodyFactory(res),
      });
    });

    req.on('error', reject);
  });
}

function bodyFactory(response: IncomingMessage): Response['body'] {
  return () =>
    new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      response.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      response.on('error', reject);
    });
}
