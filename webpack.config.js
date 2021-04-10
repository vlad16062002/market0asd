const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin")
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: './assets/js/main.js',
	output: {
		filename: 'bundle.[contenthash].js',
		path: __dirname + '/public/js',
		publicPath: '/js/'
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: __dirname + '/views/layouts/MainTemplate.hbs',
			filename: 'MainTemplate.hbs',
			inject: 'head'
		}),
		new ScriptExtHtmlWebpackPlugin({ defaultAttribute: 'defer' }),
		new MiniCssExtractPlugin({
			filename: 'bundle.[contenthash].css',
    	}),
		new CleanWebpackPlugin()
	],
	module: {
        rules: [
            {
        		test: /\.(sa|sc|c)ss$/,
        		use: [
        			{ loader: MiniCssExtractPlugin.loader },
        			'css-loader',
        		]
      		},
			{
				test: /\.(png|jpg|svg|gif)$/,
				use: ['file-loader']
			},
        ]
    }
}