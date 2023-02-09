const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin").default;
const devMode = process.env.WEBPACK_DEV_SERVER;
const version = require('./package.json').version;


console.log(MiniCssExtractPlugin)

const fileName = `[name].${version}`;

module.exports = {
   entry: {
      jshare: './src/index.js'
   },
   output: {
      filename: devMode ? '[name].js' : fileName + '.js',
      hashDigestLength: 5,
      path: path.resolve(__dirname, 'dist'),
   },
   module: {
      rules: [{
         test: /\.js?$/,
         loader: 'babel-loader',
         exclude: /node_modules/,
      }, {
         test: /\.(sa|sc|c)ss$/,
         use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader",
         ]
      }]
   },
   plugins: [
      new CleanWebpackPlugin({
         output: {
            path: './dist'
         }
      }), 
      new HtmlWebPackPlugin({
         template: "./src/index.html",
         filename: "index.html",
         minify: true
      }),
      new MiniCssExtractPlugin(
         {
            filename: devMode ? '[name].css' : fileName + '.css'
            // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
         }),
      new webpack.HotModuleReplacementPlugin(),
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