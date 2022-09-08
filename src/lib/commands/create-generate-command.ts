import { Command } from 'commander';
import { createApiCommand } from './generate/create-api-command';

export function createGenerateCommand() {
  const command = new Command('generate');

  command.addCommand(createApiCommand());

  return command;
}
