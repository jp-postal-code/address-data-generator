import { test, expect } from '@jest/globals';
import { Command } from 'commander';
import { apiAction } from '@/lib/actions/generate/api-action';

test('not implemented', async () => {
  await expect(() =>
    apiAction('**/*', { pretty: true }, new Command())
  ).rejects.toThrow('not implemented.');
});
