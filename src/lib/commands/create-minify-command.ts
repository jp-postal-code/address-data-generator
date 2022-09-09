import { minifyAction } from '@/lib/actions/minify-action';
import { Command } from 'commander';

export function createMinifyCommand() {
  const command = new Command('minify');

  command.action(minifyAction);

  return command;
}
