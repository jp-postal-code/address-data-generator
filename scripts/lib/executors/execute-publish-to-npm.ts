import { rm, copyFile, readFile, writeFile } from 'fs/promises';
import fastGlob from 'fast-glob';
import { join } from 'path';
import { spawnPromise } from '../utils/spawn-promise';

interface Params {
  args: [string, { asset: string[] }];
  events?: {
    beforeClean?: () => void;
    afterClean?: () => void;
    beforeBuild?: () => void;
    building?: (message: string) => void;
    afterBuild?: () => void;
    beforeCopyAssets?: () => void;
    copyingAssets?: (src: string, dest: string) => void;
    afterCopyAssets?: () => void;
    beforeUpdatePackageJson?: () => void;
    afterUpdatePackageJson?: () => void;
    beforePublish?: () => void;
    publishing?: (message: string) => void;
    afterPublish?: () => void;
    complete?: () => void;
  };
}

export async function executePublishToNpm(params: Params) {
  const {
    args: [distPath, { asset: assets }],
    events = {},
  } = params;

  events.beforeClean?.();
  await rm(distPath, { force: true, recursive: true });
  events.afterClean?.();

  events.beforeBuild?.();
  await runBuildProcess(params);
  events.afterBuild?.();

  events.beforeCopyAssets?.();
  for (const entry of await fastGlob(assets, { dot: true })) {
    await copyFile(entry, join(distPath, entry));
  }
  events.afterCopyAssets?.();

  events.beforeUpdatePackageJson?.();
  const packageJson: Partial<typeof import('../../../package.json')> =
    JSON.parse(await readFile('package.json', 'utf-8'));

  delete packageJson.scripts;
  delete packageJson.dependencies;
  delete packageJson.devDependencies;

  await writeFile(
    join(distPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  events.afterUpdatePackageJson?.();

  events.beforePublish?.();
  await runPublishProcess(params);
  events.afterPublish?.();

  events.complete?.();
}

async function runBuildProcess({ args: [distPath], events = {} }: Params) {
  await spawnPromise('yarn', {
    args: ['build'],
    onStdout: events.building,
    onStderr: events.building,
  });

  // #!/usr/bin/env node が消えるので無理やり追加する
  const adgJsPath = join(distPath, 'bin/adg.js');
  const contents = await readFile(adgJsPath, 'utf-8');
  await writeFile(adgJsPath, `#!/usr/bin/env node\n${contents}`);
}

async function runPublishProcess({ args: [distPath], events = {} }: Params) {
  await spawnPromise('npm', {
    args: ['publish'],
    onStdout: events.publishing,
    onStderr: events.publishing,
    cwd: distPath,
  });
}
