const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	mode: 'development',
	entry: path.resolve(__dirname, 'src', 'main.js'),
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, 'src'),
		},
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|jpg|svg|gif)$/,
				type: 'asset/resource',
			},
			{
				test: /.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'index.html'),
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src', 'false-start-icon.png'),
					to: path.resolve(__dirname, 'dist'),
				},
				{
					from: path.resolve(__dirname, 'src', 'reaction-icon.png'),
					to: path.resolve(__dirname, 'dist'),
				},
				{
					from: path.resolve(__dirname, 'src', 'result-icon.png'),
					to: path.resolve(__dirname, 'dist'),
				},
				{
					from: path.resolve(__dirname, 'src', 'waiting-icon.png'),
					to: path.resolve(__dirname, 'dist'),
				},
			],
		}),
	],
	devServer: {
		port: 3000,
	},
}
