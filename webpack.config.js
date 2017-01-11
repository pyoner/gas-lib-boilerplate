var path = require('path');
var webpack = require('webpack');
var RemoveWebpackPlugin = require('remove-webpack-plugin');
var Bump = require("bump-webpack-plugin");
var PathChunkPlugin = require('path-chunk-webpack-plugin');


var SRC_DIR = path.join(__dirname, 'src');
var TEST_DIR = path.join(__dirname, 'tests');
var BUILD_DIR = path.join(__dirname, 'build');
var NODE_DIR = path.join(__dirname, 'node_modules');

var UGLIFY_COMMON_OPTIONS = {
    mangle: false,
    output: {
        quote_keys: true,
    }
}

var UGLIFY_DEV_OPTIONS = Object.assign({}, UGLIFY_COMMON_OPTIONS, {
    beautify: true,
});

var UGLIFY_PROD_OPTIONS = Object.assign({}, UGLIFY_COMMON_OPTIONS, {
    compress: {
        warnings: false,
    }
})

var config = {
    entry: {
        webapp: [
            './src/index.js'
        ],
    },
    output: {
        path: BUILD_DIR,
        filename: '[name]-[chunkhash].js',
        chunkFilename: '[name]-[chunkhash].js'
    },
    resolveLoader: {
        root: NODE_DIR,
    },
    module: {
        loaders: [{
                test: /\.json$/,
                loader: 'json',
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: [SRC_DIR, TEST_DIR],
            }
        ]
    },
    plugins: [
        new RemoveWebpackPlugin([BUILD_DIR]),
        new Bump(['package.json']),
        new webpack.BannerPlugin('this.window = this;', { raw: true }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new PathChunkPlugin({
            name: 'libs',
            test: 'node_modules/'
        }),
    ],
    node: {
        fs: 'empty',
    }
}
if (process.env.NODE_ENV === 'production') {
    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            'process.env': { 'NODE_ENV': JSON.stringify('production') }
        }),
        new webpack.optimize.UglifyJsPlugin(UGLIFY_PROD_OPTIONS)
    ])
} else {
    config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin(UGLIFY_DEV_OPTIONS)
    ])
}

module.exports = config;
