import { minifyAction } from '@/lib/actions/minify-action';
import { Argument, Command } from 'commander';

export function createMinifyCommand() {
  const command = new Command('minify');

  command
    .addArgument(new Argument('glob', 'glob of target files'))
    .action(minifyAction);

  return command;
}
