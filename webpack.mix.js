let mix = require("laravel-mix");
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed || {};

// Create a new object with only the REACT_APP_ variables
const envKeys = Object.keys(env).reduce((prev, next) => {
  if (next.startsWith('REACT_APP_')) {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
  }
  return prev;
}, {});

// Compile modern JavaScript and copy index.html / assets
mix.js("src/index.js", "index.js").react().setPublicPath("dist");
mix.copy("src/index.html", "dist/index.html");
mix.copy("src/assets/images", "dist/images");

// Add support for client-side routing (handles page refreshes) and polyfills
mix.webpackConfig({
    devServer: {
        historyApiFallback: true,
        contentBase: './dist',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false // Disable the requirement for extensions in import paths
                }
            }
        ]
    },
    resolve: {
        fallback: {
            "process": require.resolve("process/browser"),
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "util": require.resolve("util"),
        }
    },
    plugins: [
        new webpack.DefinePlugin(envKeys)
    ]
});

// Disable success notifications
mix.disableSuccessNotifications();
