import { spawn } from 'child_process';

interface SpawnPromiseOptions {
  args?: string[];
  onStdout?(chunk: string): void;
  onStderr?(chunk: string): void;
  cwd?: string;
}

export function spawnPromise(
  command: string,
  { args = [], onStdout, onStderr, cwd }: SpawnPromiseOptions = {}
) {
  return new Promise<void>((resolve, reject) => {
    const process = spawn(command, args, {
      cwd,
    });

    let message = '';

    process.stdout.on('data', (chunk: Buffer) => {
      const chunkStr = chunk.toString();
      onStdout?.(chunkStr);
      message += chunkStr;
    });
    process.stderr.on('data', (chunk: Buffer) => {
      const chunkStr = chunk.toString();
      onStderr?.(chunkStr);
      message += chunkStr;
    });

    process.on('exit', (exitCode) => {
      if (exitCode === 0) {
        resolve();
      } else {
        const fullCommand = `${command} ${args.join(' ')}`;
        reject(
          new Error(`An error occurred during "${fullCommand}"\n${message}`)
        );
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}
