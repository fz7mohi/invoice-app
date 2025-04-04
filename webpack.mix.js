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

// Add BREVO_API_KEY to the environment variables
envKeys['window.BREVO_API_KEY'] = JSON.stringify(env.REACT_APP_BREVO_API_KEY || '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');

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
