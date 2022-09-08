import { Box, Text } from 'ink';
import React, { FC } from 'react';
import { executePublishToNpm } from '../executors/execute-publish-to-npm';
import { usePublishToNpm } from '../hooks/use-publish-to-npm';

interface Props {
  args: Parameters<typeof executePublishToNpm>[0]['args'];
}

export const PublishToNpm: FC<Props> = ({ args }) => {
  const {
    cleanState,
    buildState,
    buildingOutput,
    copyAssetsState,
    copyingAsset,
    updatePackageJsonState,
    publishState,
    publishingOutput,
    completed,
  } = usePublishToNpm(args);

  return (
    <>
      {cleanState !== 'beforeRun' && (
        <Box>
          <Text color={cleanState === 'completed' ? 'green' : undefined}>
            {cleanState === 'running'
              ? 'Cleaning dist...'
              : '✔ Successfully dist'}
          </Text>
        </Box>
      )}
      {buildingOutput && (
        <>
          <Box>
            <Text color="gray">Compilation output:</Text>
          </Box>
          <Box marginLeft={4}>
            <Text color="gray">{buildingOutput}</Text>
          </Box>
        </>
      )}
      {buildState !== 'beforeRun' && (
        <Box>
          <Text color={buildState === 'completed' ? 'green' : undefined}>
            {buildState === 'running' ? 'Building...' : '✔ Successfully build'}
          </Text>
        </Box>
      )}
      {copyAssetsState !== 'beforeRun' && (
        <Box>
          <Text color={copyAssetsState === 'completed' ? 'green' : undefined}>
            {copyAssetsState === 'running'
              ? `Copy "${copyingAsset?.src}" to "${copyingAsset?.dest}"`
              : '✔ Successfully copy assets'}
          </Text>
        </Box>
      )}
      {updatePackageJsonState !== 'beforeRun' && (
        <Box>
          <Text
            color={updatePackageJsonState === 'completed' ? 'green' : undefined}
          >
            {updatePackageJsonState === 'running'
              ? 'Updating package.json...'
              : '✔ Successfully update package.json'}
          </Text>
        </Box>
      )}

      {publishingOutput && (
        <>
          <Box>
            <Text color="gray">Publish output:</Text>
          </Box>
          <Box marginLeft={4}>
            <Text color="gray">{publishingOutput}</Text>
          </Box>
        </>
      )}
      {publishState !== 'beforeRun' && (
        <Box>
          <Text color={publishState === 'completed' ? 'green' : undefined}>
            {publishState === 'running'
              ? 'Publishing...'
              : '✔ Successfully publish'}
          </Text>
        </Box>
      )}
      {completed && (
        <Box>
          <Text color="green">✔ Successfully published to npm!</Text>
        </Box>
      )}
    </>
  );
};
