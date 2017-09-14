var webpack = require('webpack');
var path = require('path');

module.exports = {
	context: __dirname + '/sources',
	entry: {
		fsm: './fsm.js'
	},
	//entry: ['babel-polyfill', './fsm.js'],
	output: {
		path: __dirname,
		filename: 'fsm.js',
		libraryTarget: 'var',
		library: 'fsm'
	},
	plugins: [
		new webpack.ProvidePlugin({
			$fsm: '$fsm',
			$fsm0: '$fsm0'
		}),
		new webpack.DefinePlugin({
			WEB: JSON.stringify(true),
			STATELESS: JSON.stringify(false)
		})
	],
	externals:[{
		xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
	}],
	node: {
		fs: 'empty'
	}
}
