const webpack = require('webpack');
const conf = require('../gulp.conf');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: 'eslint-loader'
      },
      {
        test: /\.woff2?$/i,
        use: 'url-loader?limit=8192',
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],
  devtool: 'inline-source-map',
  context: path.join(process.cwd(), conf.paths.src),
  entry: './app.js'
};
