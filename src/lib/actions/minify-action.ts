import { Action } from '../types/action';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Listr } from 'listr2';
import fastGlob from 'fast-glob';
import { minify } from '../minify/minify';

export const minifyAction: Action<[string]> = async (glob) => {
  const tasks = createListr({
    glob,
  });
  await tasks.run();
};

interface Context {
  glob: string;
  paths?: string[];
}

function createListr(context: Context): Listr<Context> {
  return new Listr<Context>(
    [
      {
        title: 'Glob',
        async task(ctx) {
          ctx.paths = await fastGlob(ctx.glob, { dot: true, onlyFiles: true });
        },
      },
      {
        title: 'Minify',
        async task({ paths }, task) {
          if (paths == null || paths.length === 0) {
            task.skip('Skip because file not found.');
            return;
          }

          let completedCount = 0;
          await minify({
            paths,
            onMinified() {
              ++completedCount;
              task.output = `${completedCount}/${paths.length}`;
            },
          });
        },
      },
    ],
    {
      ctx: context,
      concurrent: false,
    }
  );
}
