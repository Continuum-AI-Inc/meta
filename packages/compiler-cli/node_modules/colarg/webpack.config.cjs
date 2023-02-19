const path = require('path');

module.exports = {
	mode: 'production',
	entry: './dist/index.js',
	experiments: {
		outputModule: true
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.min.js',
		library: {
			type: "module"
		}
	},
};