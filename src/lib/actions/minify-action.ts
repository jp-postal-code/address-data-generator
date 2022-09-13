import { Action } from '../types/action';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Listr } from 'listr2';
import fastGlob from 'fast-glob';
import { minify } from '../minify/minify';
import { Observable } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';

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
        task({ paths }, task) {
          if (paths == null || paths.length === 0) {
            task.skip('Skip because file not found.');
            return;
          }

          return new Observable((observer) => {
            (async () => {
              try {
                await minify({
                  paths,
                  onMinified() {
                    observer.next();
                  },
                });
                observer.complete();
              } catch (error) {
                observer.error(error);
              }
            })();
          }).pipe(
            map((_, i) => {
              const percent = (i / paths.length) * 100;
              return `${i}/${paths.length} ${percent.toFixed(1)}%`;
            }),
            throttleTime(1000)
          );
        },
      },
    ],
    {
      ctx: context,
      concurrent: false,
    }
  );
}
