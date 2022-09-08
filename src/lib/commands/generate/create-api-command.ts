import { apiAction } from '@/lib/actions/generate/api-action';
import { Argument, Command, Option } from 'commander';

export function createApiCommand() {
  const command = new Command('api');

  command
    .addArgument(new Argument('output dir', 'output directory'))
    .addOption(new Option('--pretty', 'pretty output'))
    .action(apiAction);

  return command;
}
