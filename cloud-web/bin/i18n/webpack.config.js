const path = require('path');

function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: './bin/i18n/build.js',
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'index.js'
    },
    target: 'async-node',
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    }
};
