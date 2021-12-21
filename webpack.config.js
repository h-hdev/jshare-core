const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.WEBPACK_DEV_SERVER;

module.exports = {
   entry: './src/index.js',
   output: {
      filename: devMode ? '[name].js' : '[name].[hash].js',
      hashDigestLength: 10
   },
   module: {
      rules: [{
         test: /\.js?$/,
         loader: 'babel-loader',
         exclude: /node_modules/,
      }, {
         test: /\.css?$/,
         use: ['style-loader', 'css-loader'],
      },{
         test: /\.scss?$/,
         use: ['style-loader', 'css-loader', 'sass-loader']
      }]
   },
   plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
         template: "./src/index.html",
         filename: "index.html",
         minify: true
      }),
      new MiniCssExtractPlugin({
         filename: devMode ? '[name].css' : '[name].[hash].css',
         chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      }),
      new webpack.HotModuleReplacementPlugin(),
      // new webpack.DefinePlugin({
      //    PRODUCTION: !devMode
      // })
   ],
   // devtool: devMode ? 'inline-source-map' : '',
   devServer: {
      static: {
         directory: path.join(__dirname, 'public'),
      },
      port: 9090,
      host: '0.0.0.0',
      compress: true,
      // from: https://github.com/webpack/webpack-dev-server/issues/1604
      // disableHostCheck: true,
      // hot: true,
      // sockHost: 'portal.jianshukeji.com.cn',
      // sockPort: 80,
      // // from : https://stackoverflow.com/questions/40516288/webpack-dev-server-with-nginx-proxy-pass
      // watchOptions: {
      //    aggregateTimeout: 300,
      //    poll: 1000
      // }
   }
};