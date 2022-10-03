const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
    return ({
        entry: { index: path.resolve(__dirname, 'public', 'src', 'main.js') },
        output: { path: path.resolve(__dirname, 'build'), filename: 'main.js' },
        plugins: [
            new HTMLWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'src', 'index.html'),
            }),

            new CopyPlugin({
                patterns: [{ from: 'public/' }],
            }),
        ],
        
        // Config for your testing server
        devServer: {
            compress: false,
            static: false,
            client: {
                logging: "warn",
                overlay: {
                    errors: true,
                    warnings: false,
                },
                progress: true,
            },
            port: 1234, host: '0.0.0.0'
        },

        // Web games are bigger than pages, disable the warnings that our game is too big.
        performance: { hints: false },

        // Enable sourcemaps while debugging
        devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,

        // Minify the code when making a final build
        optimization: {
            minimize: argv.mode === 'production',
            minimizer: [new TerserPlugin({
                terserOptions: {
                    ecma: 6,
                    compress: { drop_console: true },
                    output: { comments: false, beautify: false },
                },
            })],
        },
        
    });
}