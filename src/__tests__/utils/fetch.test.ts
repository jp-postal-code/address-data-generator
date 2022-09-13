import { fetch } from '@/lib/utils/fetch';
import { test, expect, jest, afterEach } from '@jest/globals';
import { IncomingMessage } from 'http';
import https from 'https';

afterEach(() => {
  jest.restoreAllMocks();
});

test('returns response promise', async () => {
  const response = await fetch('https://www.google.com/');

  expect(response.statusCode).toBe(200);
  expect(response.statusMessage).toBe('OK');

  const body = await response.body();
  expect(body).toBeInstanceOf(Buffer);
  expect(body.length).toBeGreaterThan(0);
});

test('throw error if statusCode is undefined', async () => {
  jest.spyOn(https, 'get').mockImplementation(((
    url: string,
    callback: (res: IncomingMessage) => void
  ) => {
    callback({} as IncomingMessage);

    return {
      on: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any);

  await expect(fetch('https://www.google.com/')).rejects.toThrow(
    `unknown status code:`
  );
});
