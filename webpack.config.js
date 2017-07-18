var webpack = require('webpack');
var path = require('path');

module.exports = {
	context: __dirname + '/sources',
	entry: {
		fsm: './fsm.js'
	},
	output: {
		path: __dirname,
		filename: 'fsm.js',
		libraryTarget: 'var',
		library: 'fsm'
	},
	plugins: [
		new webpack.ProvidePlugin({
			fsm: 'fsm'
		}),
		new webpack.DefinePlugin({
			WEB: JSON.stringify(true)
		})
	],
	externals:[{
		xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
	}],
	node: {
		fs: 'empty'
	}
}
