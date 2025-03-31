const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      process: require.resolve('process/browser'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      util: require.resolve('util'),
      buffer: require.resolve('buffer'),
      assert: require.resolve('assert')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]
};
