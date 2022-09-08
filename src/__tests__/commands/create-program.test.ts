import { createProgram } from '@/lib/commands/create-program';
import { test, expect } from '@jest/globals';

test('include all commands', () => {
  const program = createProgram();

  expect(program.commands).toHaveLength(2);
  expect(program.commands[0].name()).toBe('generate');
  expect(program.commands[0].commands).toHaveLength(1);
  expect(program.commands[0].commands[0].name()).toBe('api');

  expect(program.commands[1].name()).toBe('minify');
});
