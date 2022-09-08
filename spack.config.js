const { config } = require('@swc/core/spack');

module.exports = config({
  target: 'node',
  entry: {
    'bin/adg': __dirname + '/src/bin/adg.ts',
  },
  output: {
    path: __dirname + '/dist',
  },
});
