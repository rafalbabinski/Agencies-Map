const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.js'
  },
  mode: !isProduction ? 'development' : 'production',
  devtool: !isProduction ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isProduction
          ? {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }

          }
          : {
            loader: 'style-loader',
            options: {
              sourceMap: !isProduction
            }
          }, 
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction
            }
          }, 
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')
              ],
              sourceMap: !isProduction
            }
          }, 
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction
            }
          }
        ],
      },
      {
        test: /\.(png|jpg|svg|gif|webp)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Agencies Map',
      template: './src/index.html',
  }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
    new OptimizeCssAssetsPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};