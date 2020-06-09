const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { isLocal } = slsw.lib.webpack;

module.exports = {
    context: __dirname,
    mode: isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    devtool: isLocal ? 'cheap-module-eval-source-map' : 'source-map',
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    module: {
        rules: [
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.(ts|js)x?$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, '.serverless'),
                    path.resolve(__dirname, '.webpack'),
                ],
                use: [
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve('.webpackCache'),
                        },
                    },
                    'babel-loader',
                ],
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            eslint: true,
            eslintOptions: {
                cache: true,
            },
        }),
    ],
};
