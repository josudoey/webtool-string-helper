const { distPath } = require('../expose')
const config = require('./config')
module.exports = Object.assign({}, config, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    devMiddleware: {
      writeToDisk: true
    },
    static: [{
      serveIndex: true,
      directory: distPath
    }]
  }
})
