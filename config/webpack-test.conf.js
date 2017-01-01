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
        loaders: 'style!css!sass'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: [],
  debug: true,
  devtool: 'inline-source-map'
};
