let mix = require("laravel-mix");
const webpack = require('webpack');

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
            "buffer": require.resolve("buffer"),
            "assert": require.resolve("assert")
        },
        alias: {
            "process/browser": require.resolve("process/browser")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ]
});

// Disable success notifications
mix.disableSuccessNotifications();
