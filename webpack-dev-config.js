const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const getRules = require('./webpack-common.loader');
const { version } = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolve = dir => path.resolve(__dirname, dir);

const devServer = {
    clientLogLevel: 'info',
    disableHostCheck: true,
    port: '2015',
    // host: '192.168.0.102',
    hot: true,
    contentBase: [
        path.join(__dirname, './src'),
        path.join(__dirname, './coverage')
    ],
    compress: true,
    overlay: {
        warnings: false,
        errors: true
    }
};

console.info('[GridManager] Demo is running at: http://localhost:2015/demo/index.html');
console.info('[GridManager] Coverage is running at: http://localhost:2015/chart');
const config = {
    mode: 'development',
	// map

    devtool: 'eval-cheap-source-map',

    devServer,

    // 入口文件配置
	context: path.join(__dirname, 'src/'),

	// 入口文件配置
	entry: {
		js: './module/index.js'
	},

	// 配置模块如何解析
	resolve: {
		extensions: ['.js'], // 当requrie的模块找不到时,添加这些后缀
        alias: {
            '@common': resolve('src/common'),
            '@jTool': resolve('src/jTool'),
            '@module': resolve('src/module')
        }
	},

	// 文件导出的配置
	output: {
		path: '/',
		filename: 'js/gm.js',
		// publicPath 对于热替换（HMR）是必须的，让webpack知道在哪里载入热更新的模块（chunk）
		publicPath: '/'
	},

	// 以插件形式定制webpack构建过程
	plugins: [
        // 将样式文件 抽取至独立文件内
        new MiniCssExtractPlugin({
            filename: 'css/gm.css',
            chunkFilename: '[id].css'
        }),

        // 配置环境变量
        new webpack.DefinePlugin({
            'process.env': {
                VERSION: JSON.stringify(version)
            }
        }),

        // 使用交互式可缩放树形图可视化webpack输出文件的大小
        // https://www.npmjs.com/package/webpack-bundle-analyzer
        new BundleAnalyzerPlugin({
            // 是否启动后打开窗口
            openAnalyzer: false
        })
	],

	// 处理项目中的不同类型的模块
	module: {
		rules: getRules()
	}
};

module.exports = config;
