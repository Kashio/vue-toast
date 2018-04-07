const conf = require('../gulp.conf');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
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
        use: [MiniCssExtractPlugin.loader, 'css-loader?minimize', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin('index-[contenthash].css'),
  ],
  context: path.join(process.cwd(), conf.paths.src),
  output: {
    path: path.join(process.cwd(), conf.paths.dist),
    filename: '[name].js',
    library: 'VueToast',
    libraryTarget: 'commonjs2'
  },
  entry: {
    index: './index.js'
  }
};
