const webpack = require('webpack');
const conf = require('../gulp.conf');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.woff2?$/i,
        loader: 'url?limit=8192'
      },
      {
        test: /\.s?css$/,
        loaders: ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css?minimize!sass'
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
    }),
    new ExtractTextPlugin('index.css')
  ],
  output: {
    path: path.join(process.cwd(), conf.paths.dist),
    filename: '[name].js',
    library: 'VueToast',
    libraryTarget: 'commonjs2'
  },
  entry: {
    index: `./${conf.path.src('index.js')}`
  }
};
