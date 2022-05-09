/* eslint-disable */
const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");
const mix = require("laravel-mix");
const ESLintPlugin = require("eslint-webpack-plugin");
const {exec} = require('child_process');
const chokidar = require('chokidar');

Mix.extractingStyles = false;

mix.webpackConfig({
    output: {
        filename     : "[name].js",
        chunkFilename: "chunks/[name].[contenthash].js"
    },

    stats: "errors-warnings",

    module: {
        rules: [
            {
                test: /\.(ogg|mp3)$/i,
                use : [
                    {
                        loader : "file-loader",
                        options: {
                            outputPath: "sounds"
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "./resources/js"),
            path.resolve(__dirname, "./resources")
        ],
        alias  : {
            "@material-ui/core"  : "@mui/material",
            "@material-ui/styles": "@mui/styles",
        }
    },

    devServer: {
        allowedHosts: 'all',
    },

    devtool: mix.inProduction() ? false : "source-map",

    infrastructureLogging: {
        level: "info"
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                "+(js|css|sounds|chunks|images|fonts)/**/*",
                "report.html"
            ],
            cleanStaleWebpackAssets     : false
        }),
        new ESLintPlugin({fix: true})
    ]
});


mix.options({
    postCss: [require("postcss-at-rules-variables"), require("postcss-each")]
});

if (!Mix.isWatching() && !Mix.inProduction()) {
    mix.webpackConfig({
        plugins: [new BundleAnalyzerPlugin({analyzerMode: "static"})]
    });
}

const url = new URL(process.env.APP_URL);
const hmrHost = "app." + url.hostname.replace(/^www\./, "");
const hmrPort = 8080;

mix.options({
    hmrOptions: {
        host: hmrHost,
        port: hmrPort
    }
});

if (Mix.isWatching()) {
    mix.setResourceRoot(`//${hmrHost}:${hmrPort}/`);
}

mix.webpackConfig({
    devServer: {
        host: "0.0.0.0",
        port: hmrPort
    }
});


const generateRoute = () => new Promise((resolve, reject) => {
    exec("php artisan ziggy:generate", (error, stdout) => {
        return error ? reject(error) : resolve(stdout);
    })
});

if (Mix.isWatching()) {
    chokidar.watch(['routes/**/*.php', 'config/ziggy.php']).on('change', (path) => {
        console.log(`${path} changed.`)
        generateRoute().then(o => console.log(o))
    });
}

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.before(() => generateRoute().then(o => console.log(o)));

mix.js("resources/js/index.js", "js").react()
mix.js("resources/vendor/socket.js", "vendor");
mix.js("resources/vendor/pusher.js", "vendor");

if (mix.inProduction()) {
    mix.version();
}