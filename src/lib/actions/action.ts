import { Command } from 'commander';

export type Action<ARGS extends unknown[] = [], OPTIONS = unknown> = (
  ...args: [...ARGS, OPTIONS, Command]
) => void | Promise<void>;
