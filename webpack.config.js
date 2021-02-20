const path = require('path')
const webpack = require('webpack')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


const comonConf = {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 5490
  },
  /* optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/,
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    })],
  }, */
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
}


const conf1 = {
  ...comonConf,
  entry: {
    "main": "./_index.js",
    "main.min": "./_index.js",
  },
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'index.js',
  }
}

const conf2 = {
  ...comonConf,
  entry: {
    "main": "./_index.js",
    "main.min": "./_index.js",
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  }
}



module.exports = [
  conf1,
  conf2
]
