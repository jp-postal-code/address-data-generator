import { useApp } from 'ink';
import { useEffect, useRef, useState } from 'react';
import { executePublishToNpm } from '../executors/execute-publish-to-npm';

type RunningState = 'beforeRun' | 'running' | 'completed';

export function usePublishToNpm(
  args: Parameters<typeof executePublishToNpm>[0]['args']
) {
  const { exit } = useApp();
  const [cleanState, setCleanState] = useState<RunningState>('beforeRun');
  const [buildState, setBuildState] = useState<RunningState>('beforeRun');
  const [buildingOutputChunk, setBuildingOutputChunk] = useState<string>();
  const [copyAssetsState, setCopyAssetsState] =
    useState<RunningState>('beforeRun');
  const [copyingAsset, setCopyingAsset] = useState<{
    src: string;
    dest: string;
  }>();
  const [updatePackageJsonState, setUpdatePackageJsonState] =
    useState<RunningState>('beforeRun');
  const [publishState, setPublishState] = useState<RunningState>('beforeRun');
  const [publishingOutputChunk, setPublishingOutputChunk] = useState<string>();
  const [completed, setCompleted] = useState(false);
  const buildingOutputRef = useRef<string>();
  const publishingOutputRef = useRef<string>();

  useEffect(() => {
    (async () => {
      try {
        await executePublishToNpm({
          args,
          events: {
            beforeClean() {
              setCleanState('running');
            },
            afterClean() {
              setCleanState('completed');
            },
            beforeBuild() {
              setBuildState('running');
            },
            building(message) {
              setBuildingOutputChunk(message);
            },
            afterBuild() {
              setBuildState('completed');
            },
            beforeCopyAssets() {
              setCopyAssetsState('running');
            },
            copyingAssets(src, dest) {
              setCopyingAsset({ src, dest });
            },
            afterCopyAssets() {
              setCopyAssetsState('completed');
            },
            beforeUpdatePackageJson() {
              setUpdatePackageJsonState('running');
            },
            afterUpdatePackageJson() {
              setUpdatePackageJsonState('completed');
            },
            beforePublish() {
              setPublishState('running');
            },
            publishing(message) {
              setPublishingOutputChunk(message);
            },
            afterPublish() {
              setPublishState('completed');
            },
            complete() {
              setCompleted(true);
            },
          },
        });
      } catch (error) {
        exit(error as Error);
      }
    })();
  }, [args, exit]);

  useEffect(() => {
    if (buildingOutputChunk) {
      buildingOutputRef.current ??= '';
      buildingOutputRef.current += buildingOutputChunk;
    }
  }, [buildingOutputChunk]);

  useEffect(() => {
    if (publishingOutputChunk) {
      publishingOutputRef.current ??= '';
      publishingOutputRef.current += publishingOutputChunk;
    }
  }, [publishingOutputChunk]);

  return {
    cleanState,
    buildState,
    buildingOutput: buildingOutputRef.current,
    copyAssetsState,
    copyingAsset,
    updatePackageJsonState,
    publishState,
    publishingOutput: publishingOutputRef.current,
    completed,
  };
}
