const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: './src/main.js',
  // mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    inline: true,
    port: 8001
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    }]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
}
