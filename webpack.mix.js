let mix = require("laravel-mix");

// Compile modern JavaScript and copy index.html / assets
mix.js("src/index.js", "index.js").react().setPublicPath("dist");
mix.copy("src/index.html", "dist/index.html");
mix.copy("src/assets/images", "dist/images");

// Add support for client-side routing (handles page refreshes)
mix.webpackConfig({
    devServer: {
        historyApiFallback: true,
        contentBase: './dist',
    }
});

// Disable success notifications
mix.disableSuccessNotifications();
