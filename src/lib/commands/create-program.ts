import { Command } from 'commander';
import { createGenerateCommand } from './create-generate-command';
import { createMinifyCommand } from './create-minify-command';

export function createProgram() {
  const program = new Command('adg');

  program.addCommand(createGenerateCommand());
  program.addCommand(createMinifyCommand());

  program.parseAsync();
}
