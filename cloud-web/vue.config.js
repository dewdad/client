var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CompressionPlugin = require('compression-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
function resolve(dir) {
    console.log(__dirname);
    return path.join(__dirname, dir);
}

const vueConfig = {
    // 基本路径
    baseUrl: process.env.NODE_ENV === 'production' ? '/' : '/',
    // 输出文件目录
    outputDir: 'dist',
    // 设置js css image文件输出目录
    assetsDir: 'assets',
    pages: {
        index: {
            // entry for the page
            entry: 'src/main.js',
            // the source template
            template: 'src/index.html',
            // output as dist/index.html
            filename: 'index.html'
        }
        // when using the entry-only string format,
        // template is inferred to be `public/subpage.html`
        // and falls back to `public/index.html` if not found.
        // Output filename is inferred to be `subpage.html`.
    },
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    runtimeCompiler: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // mutate config for production...
        } else {
            // mutate for development...
        }
        // 配置路径别名
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('@public', resolve('public'));
        // ESlint
        config.module
            .rule('vue')
            .use('eslint-loader')
            .loader('eslint-loader')
            .tap(options => {
                // modify the options...
                return {
                    formatter: require('eslint-friendly-formatter')
                };
            });
        if (process.env.VUE_APP_EVN === 'check') {
            config.module
                .rule('vue')
                .use(path.resolve('check.js'))
                .loader(path.resolve('check.js'))
                .tap(options => {
                    // modify the options...
                    return {
                        hashLength: 4,
                        writeFile: true, //是否写语言文件，如果在webpack打包的时候写语言文件可能会导致文件写到一半被打包进production的代码中
                        repeatFlag: '\\[R\\]',
                        root: 'locales',
                        upgradeLangs: false, // 第一次升级用true
                        prefix: '',
                        originalLang: 'zh_Hans_CN', // 原语言名
                        targetLangs: ['zh_Hant_HK', 'en_US'], // 目标语言，如有zh_Hant_HK则会自动生成繁体翻译
                        deprecatedMark: '****DEPRECATED****', // 对一些旧的翻译进行标记
                        cacheTime: 5000
                    };
                });
        }
    },
    // configureWebpack 选项提供一个对象，该对象将会被 webpack-merge 合并入最终的 webpack 配置。
    configureWebpack: {
        optimization: {
            minimizer: [
                // we specify a custom UglifyJsPlugin here to get source maps in production
            ]
        },
        plugins: [
            // new BundleAnalyzerPlugin()
        ],
        externals: {
            vue: 'Vue',
            echarts: 'echarts',
            'element-ui': 'ELEMENT',
            'vue-router': 'VueRouter',
            moment: 'moment',
            vuex: 'Vuex'
        }
    },
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            sass: {
                // data: path.resolve(__dirname, 'src/assets/theme/default.scss')
            }
        },
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    // pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8090,
        https: false,
        hotOnly: true,
        proxy: null, // 设置代理
        before: app => {
            // mok
            // app.get('/api/posts', (req, res) => {
            //     res.send({
            //         data: ['a', 's']
            //     })
            // })
        }
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
};
if (process.env.NODE_ENV === 'production') {
    // mutate config for production...
    // SplitChunksPlugin代码分割配置
    vueConfig.configureWebpack.plugins.push(
        // gzip压缩
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$/,
            threshold: 10240,
            minRatio: 0.8
        })
    );
    vueConfig.configureWebpack.plugins.push(
        new webpack.optimize.SplitChunksPlugin({
            chunks: 'all',
            minSize: 20000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        })
    );
    // 代码压缩
    vueConfig.configureWebpack.optimization.minimizer.push(
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                },
                ecma: 6,
                mangle: true
            },
            sourceMap: false
        })
    );
} else {
    vueConfig.configureWebpack.plugins.push(new FriendlyErrorsPlugin());
}

module.exports = vueConfig;
