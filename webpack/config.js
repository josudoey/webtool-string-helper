const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { entry, distPath, publicPath, html } = require('../expose')
const webpackOutputPath = path.join(distPath, publicPath)
module.exports = {
  target: 'web',
  mode: 'production',
  entry: entry,
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  output: {
    clean: {
      keep (asset) {
        // console.log(asset)
        return asset.includes('ignored/dir')
      }
    },
    path: webpackOutputPath,
    publicPath: publicPath,
    filename: '[contenthash].js',
    chunkFilename: '[contenthash].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      new TerserPlugin({}),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
    ]
  },
  module: {
    rules: [{
      test: /\.(png|jpe?g|gif|svg)$/,
      type: 'asset/resource',
      generator: {
        filename: './img/[contenthash][ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: './font/[contenthash][ext]'
      }
    }, {
      test: /\.html$/,
      loader: require.resolve('html-loader'),
      options: {
        minimize: true
      }
    }, {
      test: /render.pug$/,
      use: [{
        loader: require.resolve('vue-loader/lib/loaders/templateLoader.js'),
        options: {
          minimize: {
            collapseBooleanAttributes: true
          }
        }
      }, {
        loader: require.resolve('pug-plain-loader')
      }]
    }, {
      test: /template.pug$/,
      use: [{
        loader: require.resolve('html-loader'),
        options: {
          minimize: {
            collapseBooleanAttributes: true
          }
        }
      }, {
        loader: require.resolve('pug-plain-loader')
      }]
    }, {
      test: /module\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../'
        }
      }, {
        loader: require.resolve('css-loader'),
        options: {
          modules: {
            namedExport: true,
            localIdentName: '__[hash:base64:5]'
          },
          importLoaders: 0
        }
      }]
    }, {
      test: /\.css$/,
      exclude: /module\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../'
        }
      }, {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 0
        }
      }]
    }, {
      test: /\.s(c|a)ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../'
          }
        }, {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 0
          }
        },
        {
          loader: require.resolve('sass-loader'), // Requires sass-loader@^7.0.0
          options: {
            implementation: require('sass'), // Requires >= sass-loader@^8.0.0
            sassOptions: {
              indentedSyntax: true // optional
            }
          }
        }
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[contenthash].css',
      chunkFilename: 'css/[contenthash].css'
    }),
    new HtmlWebpackPlugin(Object.assign({}, html, {
      inject: true,
      template: path.resolve(__dirname, './template.ejs'),
      filename: './index.html',
      alwaysWriteToDisk: true
    }))
  ]
}
