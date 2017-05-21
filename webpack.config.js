process.env.NODE_ENV = require('./package.json').debug;
const debug = process.env.NODE_ENV == 'production';
const webpack = require('webpack');

module.exports = {
	context: __dirname + '/',
	devtool: debug ? '#inline-source-map' : "#eval",
	entry: './src/App.js',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015', 'stage-0'],
					plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']	
				}
			},
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf$/,  loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot$/,  loader: "file-loader" },
            { test: /\.(woff2)$/, loader: 'url-loader?limit=100000' },
			{
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ['file-loader?context=src/images&name=images/[path][name].[ext]', {
                    loader: 'image-webpack-loader',
                    query: {
                        mozjpeg: {
                            progressive: true,
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        optipng: {
                            optimizationLevel: 4,
                        },
                        pngquant: {
                            quality: '75-90',
                            speed: 3,
                        },
                    },
                }],
                exclude: /node_modules/,
                include: __dirname,
            }
        ]
	},
	output: {
		path: __dirname + '/dist/',
		filename: 'bundle.js'
	},
	plugins: debug ? [] : [
		new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: true
        })
	]
};