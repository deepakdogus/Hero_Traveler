
require('dotenv').config()

if (process.env.NODE_ENV === 'development') {
  require('babel-register')
  require('babel-polyfill')
  require('./src')
} else {
  require('./dist')
}
