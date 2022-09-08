import React from 'react';
import { Argument, Option, program } from 'commander';
import { Box, render, Text } from 'ink';
import { PublishToNpm } from './lib/components/publish-to-npm';
import { executePublishToNpm } from './lib/executors/execute-publish-to-npm';

program
  .addArgument(new Argument('dist path').argOptional().default('./dist'))
  .addOption(
    new Option('--asset [assets...]').default(['README.md', 'LICENSE'])
  )
  .action(
    async (...args: Parameters<typeof executePublishToNpm>[0]['args']) => {
      const instance = render(<PublishToNpm args={args} />);

      try {
        await instance.waitUntilExit();
      } catch (error) {
        if (error != null && typeof error === 'object') {
          render(
            <Box>
              <Text color="red">{error.toString()}</Text>
            </Box>
          );

          process.exit(1);
        }

        throw error;
      }
    }
  )
  .parse();
