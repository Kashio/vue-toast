const webpack = require('webpack');
const conf = require('../gulp.conf');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        postcss: [autoprefixer]
      }
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new ExtractTextPlugin("style.css")
  ],
  devtool: 'source-map',
  context: path.join(process.cwd(), conf.paths.src),
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: 'app.js'
  },
  entry: './app.js'
};
