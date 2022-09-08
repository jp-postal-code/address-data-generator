import { test, expect } from '@jest/globals';
import { Command } from 'commander';
import { minifyAction } from '@/lib/actions/minify-action';

test('not implemented', async () => {
  await expect(() =>
    minifyAction('**/*', { pretty: true }, new Command())
  ).rejects.toThrow('not implemented.');
});
